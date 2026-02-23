const Booking = require("./booking.model");
const Availability = require("../availability/availability.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");
const Payment = require("../payments/payment.model");
const Hotel = require("../hotels/hotel.model");
const razorpay = require("../../shared/config/razorpay");

const crypto = require("crypto");
const RoomType = require("../rooms/roomType.model");

//restore availability function
async function restoreAvailability(booking, session) {
  const currentDate = new Date(booking.checkIn);

  while (currentDate < booking.checkOut) {
    await Availability.findOneAndUpdate(
      {
        roomTypeId: booking.roomTypeId,
        date: new Date(currentDate),
      },
      { $inc: { availableRooms: booking.roomsBooked } },
      { session },
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

//process refund function
async function processRefund(booking, session) {
  const payment = await Payment.findById(booking.paymentId).session(session);

  if (!payment || payment.status !== "captured")
    throw new Error("Payment not eligible for refund");

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: booking.refundAmount * 100, // Razorpay expects paise
  });

  payment.status = "refunded";
  payment.refundStatus = "processed";
  payment.refundAmount = booking.refundAmount;
  payment.razorpayRefundId = refund.id;
  payment.refundedAt = new Date();

  await payment.save({ session });
}

// Create Booking + Razorpay Order
exports.createBooking = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      guests,
      roomsBooked,
      primaryGuest,
      additionalGuests = [],
    } = data;

    if (!checkIn || !checkOut)
      throw new Error("Check-in and Check-out dates are required");

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate >= endDate)
      throw new Error("Invalid check-in/check-out dates");

    const nights =
      (endDate - startDate) / (1000 * 60 * 60 * 24);

    if (nights <= 0)
      throw new Error("Invalid booking duration");

    const rooms = roomsBooked && roomsBooked > 0 ? roomsBooked : 1;

    if (!guests?.adults || guests.adults <= 0)
      throw new Error("At least one adult guest is required");

    if (additionalGuests.length !== guests.adults - 1)
      throw new Error("Additional guests count mismatch");

    const hotel = await Hotel.findById(hotelId).session(session);
    if (!hotel || !hotel.isActive)
      throw new Error("Hotel not available");

    const roomType = await RoomType.findById(roomTypeId).session(session);
    if (!roomType || !roomType.isActive)
      throw new Error("Room type not available");

    if (
      guests.adults > roomType.capacity.adults ||
      guests.children > roomType.capacity.children
    ) {
      throw new Error("Guest count exceeds room capacity");
    }

    //Fetch availability docs for date range
    const availabilityDocs = await Availability.find({
      roomTypeId,
      date: { $gte: startDate, $lt: endDate },
    }).session(session);

    //Build map for quick lookup
    const availabilityMap = {};
    for (const doc of availabilityDocs) {
      const dateStr = doc.date.toISOString().split("T")[0];
      availabilityMap[dateStr] = doc;
    }

    //Availability Validation (derived model)
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      const dateStr = currentDate.toISOString().split("T")[0];

      const dayDoc = availabilityMap[dateStr];

      const booked = dayDoc?.bookedRooms || 0;
      const blocked = dayDoc?.blockedRooms || 0;

      const available =
        roomType.totalRooms - booked - blocked;

      if (available < rooms) {
        throw new Error(
          `Insufficient availability on ${currentDate.toDateString()}`
        );
      }
    }

    const priceOverride =
      availabilityDocs[0]?.priceOverride;

    const pricePerNight =
      priceOverride ??
      (roomType.discountPrice > 0
        ? roomType.discountPrice
        : roomType.basePrice);

    const totalAmount = pricePerNight * nights * rooms;

    const bookingReference =
      "BK-" +
      crypto.randomBytes(6).toString("hex").toUpperCase();

    const [booking] = await Booking.create(
      [
        {
          userId,
          hotelId,
          roomTypeId,
          bookingReference,
          checkIn: startDate,
          checkOut: endDate,
          nights,
          guests,
          roomsBooked: rooms,
          primaryGuest,
          additionalGuests,
          pricePerNight,
          totalAmount,
          status: "pending",
          paymentStatus: "pending",
        },
      ],
      { session }
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: bookingReference,
    });

    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          userId,
          razorpayOrderId: razorpayOrder.id,
          amountPaid: totalAmount,
          status: "created",
        },
      ],
      { session }
    );

    booking.paymentId = payment._id;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      booking,
      razorpayOrder,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: createBooking", err);
    throw err;
  }
};

//Get bookings for logged-in user
exports.getUserBookings = async (userId) => {
  try {
    const bookings = await Booking.find({ userId })
      .populate({
        path: "hotelId",
        select: "name images",
      })
      .sort({ createdAt: -1 })
      .lean();

    return bookings.map((booking) => ({
      _id: booking._id,
      bookingReference: booking.bookingReference,
      hotelName: booking.hotelId?.name,
      thumbnail: booking.hotelId?.images?.[0]?.url || null,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      status: booking.status,
      totalAmount: booking.totalAmount,
    }));
  } catch (error) {
    logger.error("Service Error: getUserBookings", error);
    throw error;
  }
};

//Get booking detail by id
exports.getBookingDetail = async (bookingId, userId) => {
  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    })
      .populate("hotelId", "name description address location images")
      .populate("roomTypeId", "name amenities bedType roomSizeSqm")
      .lean();

    if (!booking) throw new Error("Booking not found");

    return {
      bookingReference: booking.bookingReference,

      status: booking.status,
      paymentStatus: booking.paymentStatus,

      hotel: {
        name: booking.hotelId.name,
        address: booking.hotelId.address,
        coordinates: booking.hotelId.location?.coordinates,
        thumbnail: booking.hotelId.images?.[0]?.url || null,
        address: booking.hotelId.address,
      },

      room: {
        name: booking.roomTypeId.name,
        amenities: booking.roomTypeId.amenities,
        bedType: booking.roomTypeId.bedType,
        roomSizeSqm: booking.roomTypeId.roomSizeSqm,
      },

      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      roomsBooked: booking.roomsBooked,
      guests: booking.guests,

      priceBreakdown: {
        pricePerNight: booking.pricePerNight,
        taxAmount: booking.taxAmount,
        cleaningFee: booking.cleaningFee,
        discountAmount: booking.discountAmount,
        totalAmount: booking.totalAmount,
      },
    };
  } catch (error) {
    logger.error("Service Error: getBookingDetail", error);
    throw error;
  }
};

//Cancel Booking (with manual or automatic refund)
exports.cancelBooking = async (bookingId, userId, mode = "manual") => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
    }).session(session);

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "confirmed")
      throw new Error("Only confirmed bookings can be cancelled");

    if (booking.checkIn <= new Date())
      throw new Error("Cannot cancel past or ongoing bookings");

    //calculate Refund
    const now = new Date();
    const daysBeforeCheckIn = (booking.checkIn - now) / (1000 * 60 * 60 * 24);

    let refundPercentage = 0;

    if (
      now - booking.createdAt <= 24 * 60 * 60 * 1000 &&
      daysBeforeCheckIn >= 7
    ) {
      refundPercentage = 100;
    } else if (daysBeforeCheckIn >= 30) {
      refundPercentage = 100;
    } else if (daysBeforeCheckIn >= 15) {
      refundPercentage = 50;
    } else {
      refundPercentage = 0;
    }

    const refundAmount = (booking.totalAmount * refundPercentage) / 100;

    booking.refundPercentage = refundPercentage;
    booking.refundAmount = refundAmount;
    booking.refundRequestedAt = now;

    if (mode === "automatic") {
      //Restore availability immediately
      await restoreAvailability(booking, session);

      booking.status = "cancelled";
      booking.refundStatus = "processed";
      booking.cancelledAt = now;
      booking.paymentStatus = "refunded";

      await processRefund(booking, session);

      booking.refundProcessedAt = new Date();
    } else {
      // Manual mode
      booking.status = "cancellation_requested";
      booking.refundStatus = "pending";
    }

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: cancelBooking", err);
    throw err;
  }
};

//admin approve or reject refund request
exports.adminHandleRefund = async (bookingId, action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== "cancellation_requested")
      throw new Error("No cancellation pending");

    if (action === "approve") {
      await restoreAvailability(booking, session);

      booking.status = "cancelled";
      booking.refundStatus = "approved";
      booking.cancelledAt = new Date();

      await processRefund(booking, session);

      booking.paymentStatus = "refunded";
      booking.refundProcessedAt = new Date();
    }

    if (action === "reject") {
      booking.status = "confirmed";
      booking.refundStatus = "rejected";
    }

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: adminHandleRefund", err);
    throw err;
  }
};
