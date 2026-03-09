const VendorBank = require("./bank.model");
const Vendor = require("../vendors/vendor.model");
const logger = require("../../shared/utils/logger");

//Create bank details
exports.createBankDetails = async (vendorId, bankData) => {
  try {
    const existingBank = await VendorBank.findOne({ vendorId });

    if (existingBank) {
      throw new Error("Bank details already added");
    }

    const bank = await VendorBank.create({
      vendorId,
      ...bankData,
      verificationStatus: "pending",
    });
    
    await Vendor.findByIdAndUpdate(vendorId, {
      registrationStep: 3,
    });

    return bank;
  } catch (error) {
    logger.error("Service Error: createBankDetails", error);
    throw error;
  }
};
