const Vendor = require("./vendor.model");
const logger = require("../../shared/utils/logger");

// Create vendor profile
exports.createVendorProfile = async (userId, vendorData) => {
  try {
    const existingVendor = await Vendor.findOne({ userId });

    if (existingVendor) {
      throw new Error("Vendor profile already exists");
    }

    const vendor = await Vendor.create({
      userId,
      ...vendorData,
      status: "draft",
      registrationStep: 2,
    });

    return vendor;
  } catch (error) {
    logger.error("Service Error: createVendorProfile", error);
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