const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    roomTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: "RoomType",
      required: true,
    },

    date: { type: Date, required: true },

    availableRooms: { type: Number, required: true },
    priceOverride: Number,
  },
  { timestamps: true },
);

availabilitySchema.index(
  { roomTypeId: 1, date: 1 },
  { unique: true },
);

module.exports = mongoose.model("Availability", availabilitySchema);
