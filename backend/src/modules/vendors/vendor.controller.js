const vendorService = require("./vendor.service");
const logger = require("../../shared/utils/logger");

exports.setupVendorProfile = async (req, res, next) => {
  try {
    const vendorData = {
      userId: req.user._id,
      businessName: req.body.businessName,
      //approved for the testing purpose
      status: "approved",
    };

    const vendor = await vendorService.registerVendor(vendorData);

    res.status(201).json({
      success: true,
      message: "Vendor profile created and approved for testing",
      data: vendor,
    });
  } catch (error) {
    logger.error("Controller Error: setupVendorProfile", error);
    next(error);
  }
};
