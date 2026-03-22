const Vendor = require("./vendor.model");
const VendorBank = require("../vendorBank/bank.model");
const Hotel = require("../hotels/hotel.model");
const User = require("../../modules/auth/auth.model")
const logger = require("../../shared/utils/logger");

// Create vendor profile
// exports.createVendorProfile = async (userId, vendorData) => {
//   try {
//     const existingVendor = await Vendor.findOne({ userId });

//     if (existingVendor) {
//       throw new Error("Vendor profile already exists");
//     }

//     const vendor = await Vendor.create({
//       userId,
//       ...vendorData,
//       status: "draft",
//       registrationStep: 2,
//     });

//     return vendor;
//   } catch (error) {
//     logger.error("Service Error: createVendorProfile", error);
//     throw error;
//   }
// };

//vendor get me for help to prefiling
exports.getVendorMe = async (userId) => {
  try {
    const user = await User.findById(userId).select("firstName lastName email");

    if (!user) {
      throw new Error("User not found");
    }

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // optional data
    const bank = await VendorBank.findOne({ vendorId: vendor._id });
    const hotel = await Hotel.findOne({ vendorId: vendor._id });

    // base response 
    const response = {
      vendor: {
        status: vendor.status,
        currentStep: vendor.currentStep,
        registrationStep: vendor.registrationStep,
        rejectedSteps: vendor.rejectedSteps || [],
        rejectionReasons: vendor.rejectionReasons || {},
        isSubmitted: vendor.isSubmitted,
      },

      businessDetails: {
        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,
        businessPhone: vendor.businessPhone,
        address: vendor.businessAddress,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
      },

      documents: vendor.verificationDocs || [],

      bankDetails: bank
        ? {
            accountHolderName: bank.accountHolderName,
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            ifscCode: bank.ifscCode,
            branchName: bank.branchName,
            upiId: bank.upiId,
            verificationStatus: bank.verificationStatus,
          }
        : null,

      hotelDetails: hotel
        ? {
            name: hotel.name,
            description: hotel.description,
            address: hotel.address,
            city: hotel.city,
            images: hotel.images,
            amenities: hotel.amenities,
            verificationStatus: hotel.verificationStatus,
          }
        : null,
    };

    //APPROVED DATA 
    if (vendor.status === "approved") {
      response.approvedData = {
        vendorName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        vendorEmail: user.email,

        businessName: vendor.businessName,
        businessEmail: vendor.businessEmail,

        hotelId: hotel?._id || null,
        hotelName: hotel?.name || null,
      };
    }

    return response;
  } catch (error) {
    throw error;
  }
};

//step-2 vendor business create profile
exports.createVendorProfile = async (userId, vendorData) => {
  try {
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor not found. Please verify OTP first.");
    }

    if (vendor.isSubmitted && vendor.status !== "rejected") {
      throw new Error("Already submitted. Cannot edit.");
    }

    if (vendor.currentStep !== 1 && vendor.status !== "rejected") {
      throw new Error("Invalid step flow");
    }

    if (vendor.status === "rejected" && !vendor.rejectedSteps.includes(2)) {
      throw new Error("Fix required step first");
    }

    Object.assign(vendor, {
      serviceType: vendorData.serviceType,
      businessName: vendorData.businessName,
      businessEmail: vendorData.businessEmail,
      businessPhone: vendorData.businessPhone,
      businessAddress: vendorData.businessAddress,
      city: vendorData.city,
      state: vendorData.state,
      country: vendorData.country,
      panNumber: vendorData.panNumber,
      aadhaarNumber: vendorData.aadhaarNumber,
      verificationDocs: vendorData.verificationDocs,
    });

    //STEP UPDATE
    vendor.currentStep = 2;
    vendor.registrationStep = Math.max(vendor.registrationStep, 2);

    if (vendor.rejectedSteps?.includes(2)) {
      vendor.rejectedSteps = vendor.rejectedSteps.filter((s) => s !== 2);
    }

    if (vendor.rejectionReasons) {
      delete vendor.rejectionReasons["2"];
    }

    if (!vendor.rejectedSteps || vendor.rejectedSteps.length === 0) {
      vendor.status = "draft";
    }

    await vendor.save();

    return vendor;
  } catch (error) {
    logger.error("Service Error: createVendorProfile", error);
    throw error;
  }
};

exports.submitVendor = async (vendor) => {
  try {
    if (vendor.isSubmitted) {
      throw new Error("Already submitted");
    }

    //step incomplete
    if (vendor.currentStep !== 4) {
      throw new Error("Please complete all steps before submitting");
    }

    //pending issues
    if (vendor.rejectedSteps && vendor.rejectedSteps.length > 0) {
      throw new Error("Please fix all issues before submitting");
    }

    if (!vendor.serviceType || !vendor.businessName) {
      throw new Error("Incomplete vendor profile");
    }

    //final submit
    vendor.status = "pending";
    vendor.isSubmitted = true;
    vendor.submittedAt = new Date();

    await vendor.save();

    return vendor;
  } catch (error) {
    logger.error("Service Error: submitVendor", error);
    throw error;
  }
};

// Get vendor profile by User ID
exports.getVendorByUserId = async (userId) => {
  try {
    return await Vendor.findOne({ userId }).lean();
  } catch (error) {
    logger.error("Service Error: getVendorByUserId", error);
    throw error;
  }
};
