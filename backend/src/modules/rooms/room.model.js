const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      required: [true, "Room must belong to a hotel"],
    },

    // Room Category (e.g., Standard, Deluxe, Suite)
    type: {
      type: String,
      required: [true, "Room type is required"],
      trim: true,
    },

    basePrice: {
      type: Number,
      required: [true, "Base price per night is required"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },

    capacity: {
      adults: { type: Number, required: true, default: 2 },
      children: { type: Number, default: 0 },
    },
    bedType: {
      type: String,
      required: [true, "Bed type is required (e.g., King Size, Double)"],
    },

    amenities: {
      type: [String], // e.g., ["AC", "Bathtub", "Balcony", "Mini Bar"]
      default: [],
    },

    totalRooms: {
      type: Number,
      required: [true, "Total number of rooms of this type is required"],
    },

    availableRooms: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

roomSchema.index({ hotelId: 1 });
roomSchema.index({ basePrice: 1 });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
