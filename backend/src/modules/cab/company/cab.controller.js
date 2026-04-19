const cabService = require("./cab.service");
const logger = require("../../../shared/utils/logger");

exports.createCabCompany = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const cab = await cabService.createCabCompany(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Cab company created successfully",
      data: cab,
    });
  } catch (error) {
    logger.error("Controller Error: createCabCompany", error);
    next(error);
  }
};
