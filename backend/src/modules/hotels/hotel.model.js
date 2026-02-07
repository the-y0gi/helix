const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    images: {
      type: [String],
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false,
      },
      grabBars: {
        type: Boolean,
        default: false,
      },
      hearingSupport: {
        type: Boolean,
        default: false,
      },
      elevator: {
        type: Boolean,
        default: false,
      },
    },

    distanceFromCenter: String,

    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

hotelSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Hotel", hotelSchema);
