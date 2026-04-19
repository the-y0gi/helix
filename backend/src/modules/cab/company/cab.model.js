const mongoose = require("mongoose");

const cabCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    address: String,

    coordinates: {
      lat: Number,
      lng: Number,
    },

    images: [String],

    description: String,

    features: [String],

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

cabCompanySchema.index({ name: "text", description: "text" });
cabCompanySchema.index({ "location.city": 1, isActive: 1 });
cabCompanySchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model("CabCompany", cabCompanySchema);
