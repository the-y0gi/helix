const Vendor = require("./vendor.model");
const logger = require("../../shared/utils/logger");

// Register a new vendor profile
exports.registerVendor = async (vendorData) => {
  try {
    const existingVendor = await Vendor.findOne({ userId: vendorData.userId });
    if (existingVendor) {
      throw new Error("Vendor profile already exists for this user");
    }

    return await Vendor.create(vendorData);
  } catch (error) {
    logger.error("Service Error: registerVendor", error);
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