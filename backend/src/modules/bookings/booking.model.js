const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    roomTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "RoomType",
      required: true,
      index: true,
    },

    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
    },

    guests: {
      adults: { type: Number, required: true },
      children: { type: Number, default: 0 },
    },

    roomsBooked: {
      type: Number,
      default: 1,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    cleaningFee: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentId: {
      type: String,
    },

    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
