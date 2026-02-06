const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Hotel must belong to a vendor"],
    },

    // Basic Hotel Information
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Hotel description is required"],
    },

    address: {
      type: String,
      required: [true, "Physical address is required"],
    },
    location: {
      // GeoJSON point for distance calculations (e.g., "5 mins from center")
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Location coordinates are required"],
      },
    },
    city: {
      type: String,
      required: [true, "City is required"],
      index: true,
    },

    images: {
      type: [String], // Array of URLs for the image slider
      validate: [
        (val) => val.length > 0,
        "At least one hotel image is required",
      ],
    },
    amenities: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    numReviews: {
      type: Number,
      default: 0,
    },

    //Display Meta (e.g., "5 mins from center")
    distanceFromCenter: {
      type: String,
      trim: true,
    },

    // Operational Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// GEOSPATIAL INDEX: Enables fast "near me" or "distance-based" searches
hotelSchema.index({ location: "2dsphere" });

// COMPOUND INDEX: For fast filtering by city and rating
hotelSchema.index({ city: 1, rating: -1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
