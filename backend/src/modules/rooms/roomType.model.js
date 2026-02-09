const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    }, // Deluxe
    description: String,

    basePrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },

    capacity: {
      adults: {
        type: Number,
        default: 2,
      },
      children: {
        type: Number,
        default: 0,
      },
    },

    bedType: String,
    roomSizeSqm: Number,

    viewType: {
      type: String,
      enum: ["city", "sea", "garden", "mountain", "none"],
      default: "none",
    },

    amenities: [String],
    images: [String],

    totalRooms: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RoomType", roomTypeSchema);
