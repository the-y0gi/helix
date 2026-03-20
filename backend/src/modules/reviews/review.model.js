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
      min: 1,
      max: 5,
    },

    breakdown: {
      cleanliness: Number,
      communication: Number,
      location: Number,
      value: Number,
    },

    comment: String,

    vendorReply: {
      message: String,
      repliedAt: Date,
    },

    isFlagged: {
      type: Boolean,
      default: false,
    },

    flagReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

reviewSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
