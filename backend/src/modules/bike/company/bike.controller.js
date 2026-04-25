const bikeService = require("./bike.service");
const logger = require("../../../shared/utils/logger");

exports.createBikeCompany = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const bike = await bikeService.createBikeCompany(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Bike company created successfully",
      data: bike,
    });
  } catch (error) {
    logger.error("Controller Error: createBikeCompany", error);
    next(error);
  }
};
