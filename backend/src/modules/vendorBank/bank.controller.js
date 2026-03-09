const bankService = require("./bank.service");
const Vendor = require("../vendors/vendor.model");
const logger = require("../../shared/utils/logger");

//Create vendor bank details
exports.createBankDetails = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const bank = await bankService.createBankDetails(vendor._id, req.body);

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: bank,
    });
  } catch (error) {
    logger.error("Controller Error: createBankDetails", error);
    next(error);
  }
};