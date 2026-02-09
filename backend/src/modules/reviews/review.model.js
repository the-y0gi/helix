const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    breakdown: {
      cleanliness: Number,
      communication: Number,
      location: Number,
      value: Number,
    },

    comment: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
