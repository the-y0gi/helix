const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //Basic Info - Only Email is Required initially
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    //Roles for RBAC (User, Vendor, Admin)
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },

    //Profile fields - User can add these later
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dob: {
      type: Date,
    },
    country: {
      type: String,
      default: "India",
    },
    avatar: {
      type: String,
    }, 
    address: {
      type: String,
      trim: true,
    },
    zipcCode: {
      type: String,
      trim: true,
    },

    // Auth Providers - For Google, Facebook, Apple
    providers: {
      local: {
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
      google: {
        id: { type: String },
        email: { type: String },
      },
      facebook: {
        id: { type: String },
        email: { type: String },
      },
      apple: {
        id: { type: String },
        email: { type: String },
      },
    },

    // OTP Logic
    otp: {
      type: String,//hashed otp
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
