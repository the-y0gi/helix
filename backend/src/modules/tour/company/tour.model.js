const mongoose = require("mongoose");

const tourCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour company name is required"],
      trim: true,
      index: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        index: true,
      },
      state: { type: String },
      country: {
        type: String,
        default: "India",
      },
    },

    address: {
      type: String,
      trim: true,
    },

    coordinates: {
      lat: Number,
      lng: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

tourCompanySchema.index({ "location.city": 1, isActive: 1 });

tourCompanySchema.index({ vendor: 1, createdAt: -1 });
tourCompanySchema.index({ name: "text", description: "text" });

const TourCompany = mongoose.model("TourCompany", tourCompanySchema);

module.exports = TourCompany;
