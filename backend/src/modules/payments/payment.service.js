const mongoose = require("mongoose");
const crypto = require("crypto");
const Booking = require("../bookings/booking.model");
const Payment = require("./payment.model");
const Availability = require("../availability/availability.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");
const {
  sendBookingConfirmationEmail,
} = require("../../shared/utils/sendEmail");

exports.verifyPayment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    }).session(session);

    if (!payment) {
      throw new Error("Payment record not found");
    }

    //Idempotency Check
    if (payment.isVerified && payment.status === "captured") {
      const existingBooking = await Booking.findById(payment.bookingId).session(
        session,
      );

      await session.commitTransaction();
      session.endSession();

      return existingBooking;
    }

    if (payment.status !== "created") {
      throw new Error("Invalid payment state");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;

    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }

    if (payment.amountPaid !== booking.totalAmount) {
      throw new Error("Payment amount mismatch");
    }
    const hotel = await Hotel.findById(booking.hotelId).session(session);
    if (!hotel || !hotel.isActive) {
      throw new Error("Hotel no longer available");
    }

    const RoomType = mongoose.model("RoomType");
    const roomTypeData = await RoomType.findById(booking.roomTypeId).session(
      session,
    );

    if (!roomTypeData) {
      throw new Error("Room type definition not found");
    }

    const startDate = new Date(booking.checkIn);
    const endDate = new Date(booking.checkOut);

    for (let i = 0; i < booking.nights; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      const result = await Availability.updateOne(
        {
          roomTypeId: booking.roomTypeId,
          date: currentDate,
          $or: [
            { availableRooms: { $gte: booking.roomsBooked } },
            { availableRooms: { $exists: false } },
          ],
        },
        {
          $setOnInsert: {
            hotelId: booking.hotelId,
            roomTypeId: booking.roomTypeId,
            date: currentDate,
            status: "available",
            totalRooms: roomTypeData.totalRooms,
          },
          $inc: { availableRooms: -booking.roomsBooked },
        },
        {
          session,
          upsert: true,
        },
      );

      if (result.matchedCount === 0 && result.upsertedCount === 0) {
        throw new Error("Rooms just sold out for specific dates.");
      }
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();
    try {
      await sendBookingConfirmationEmail(booking.primaryGuest.email, {
        customerName: booking.primaryGuest.name,
        bookingId: booking.bookingReference,
        hotelName: hotel.name,
        roomName: roomTypeData.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        amount: booking.totalAmount,
      });
    } catch (mailErr) {
      logger.error("Booking Confirmation Email failed to send:", mailErr);
    }
    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: verifyPayment", err);
    throw err;
  }
};
