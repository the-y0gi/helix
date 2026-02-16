const mongoose = require("mongoose");
const crypto = require("crypto");
const Booking = require("../bookings/booking.model");
const Payment = require("./payment.model");
const Availability = require("../availability/availability.model");
const logger = require("../../shared/utils/logger");

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

    //Idempotency check
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

    //Verify Razorpay signature
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

    const startDate = new Date(booking.checkIn);
    const endDate = new Date(booking.checkOut);

    //Fetch availability docs
    const availabilityDocs = await Availability.find({
      roomTypeId: booking.roomTypeId,
      date: { $gte: startDate, $lt: endDate },
    }).session(session);

    if (availabilityDocs.length !== booking.nights) {
      throw new Error("Availability mismatch for selected dates");
    }

    //Atomic decrement
    for (const doc of availabilityDocs) {
      const result = await Availability.updateOne(
        {
          _id: doc._id,
          availableRooms: { $gte: booking.roomsBooked },
        },
        {
          $inc: { availableRooms: -booking.roomsBooked },
        },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw new Error("Rooms just sold out. Please try again.");
      }
    }

    booking.status = "confirmed";
    booking.paymentStatus = "paid";

    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: verifyPayment", err);
    throw err;
  }
};
