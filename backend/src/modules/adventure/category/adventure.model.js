const mongoose = require("mongoose");

const adventureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Adventure name is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["rafting", "paragliding", "bungee", "trekking"],
      index: true,
    },

    location: {
      city: {
        type: String,
        required: true,
        index: true,
      },
      state: { type: String },
      country: { type: String, default: "India" },
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

    priceRange: {
      min: Number,
      max: Number,
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

adventureSchema.index({ category: 1, "location.city": 1 });

const Adventure = mongoose.model("Adventure", adventureSchema);

module.exports = Adventure;
