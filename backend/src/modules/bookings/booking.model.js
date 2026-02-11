const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.ObjectId, ref: "Hotel", required: true },
    roomTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "RoomType",
      required: true,
    },

    checkIn: Date,
    checkOut: Date,

    guests: {
      adults: Number,
      children: Number,
    },

    totalAmount: Number,

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
