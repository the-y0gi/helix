const Booking = require("./booking.model");
const Availability = require("../availability/availability.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");

//Create Booking (TRANSACTION SAFE)
exports.createBooking = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      hotelId,
      roomTypeId,
      checkIn,
      checkOut,
      guests,
      totalAmount,
    } = data;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // generate date list (checkIn inclusive, checkOut exclusive)
    const dates = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    //LOCK availability for each date
    for (const date of dates) {
      const updated = await Availability.findOneAndUpdate(
        {
          roomTypeId,
          date,
          availableRooms: { $gte: 1 },
        },
        {
          $inc: { availableRooms: -1 },
        },
        { session },
      );

      if (!updated) {
        throw new Error(
          `Room not available for date ${date.toISOString().split("T")[0]}`,
        );
      }
    }

    // Create booking
    const booking = await Booking.create(
      [
        {
          userId,
          hotelId,
          roomTypeId,
          checkIn,
          checkOut,
          guests,
          totalAmount,
          status: "confirmed",
          paymentStatus: "paid", // payment getway integration pending in future.
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return booking[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error("Service Error: createBooking", error);
    throw error;
  }
};

//Get bookings for logged-in user
exports.getUserBookings = async (userId) => {
  try {
    return await Booking.find({ userId })
      .populate("hotelId", "name city")
      .populate("roomTypeId", "name")
      .sort("-createdAt")
      .lean();
  } catch (error) {
    logger.error("Service Error: getUserBookings", error);
    throw error;
  }
};

//Cancel Booking (ROLLBACK availability)
exports.cancelBooking = async (bookingId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "confirmed",
    }).session(session);

    if (!booking) throw new Error("Booking not found or not cancellable");

    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      await Availability.findOneAndUpdate(
        {
          roomTypeId: booking.roomTypeId,
          date: new Date(d),
        },
        {
          $inc: { availableRooms: 1 },
        },
        { session },
      );
    }

    booking.status = "cancelled";
    booking.paymentStatus = "failed";
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error("Service Error: cancelBooking", error);
    throw error;
  }
};
