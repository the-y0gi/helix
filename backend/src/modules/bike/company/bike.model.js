const mongoose = require("mongoose");

const bikeCompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Bike company name is required"],
      trim: true,
    },

    location: {
      city: {
        type: String,
        required: true,
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

    images: [String],

    description: {
      type: String,
      trim: true,
    },

    features: [String],

    rentalPolicies: {
      helmetIncluded: { type: Boolean, default: false },
      fuelPolicy: { type: String, trim: true },
      securityDeposit: { type: Number, default: 0 },
      licenseRequired: { type: Boolean, default: true },
    },

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
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bikeCompanySchema.index({ "location.city": 1, isActive: 1 });
bikeCompanySchema.index({ vendor: 1, createdAt: -1 });

const BikeCompany = mongoose.model("BikeCompany", bikeCompanySchema);

module.exports = BikeCompany;