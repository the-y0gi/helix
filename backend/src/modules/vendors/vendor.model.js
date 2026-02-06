const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vendor must be linked to a User account"],
      unique: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      index: true,
    },

    // Approval Flow (Super Admin Control)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Future-proofing for Documents/KYC
    verificationDocs: [
      {
        docName: { type: String },
        docUrl: { type: String },
        isVerified: { type: Boolean, default: false },
      },
    ],

    businessEmail: { type: String, lowercase: true, trim: true },
    businessPhone: { type: String, trim: true },

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

vendorSchema.index({ status: 1 });
vendorSchema.index({ userId: 1 });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
