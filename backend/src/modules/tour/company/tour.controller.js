const tourService = require("./tour.service");
const logger = require("../../../shared/utils/logger");

exports.createTourCompany = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const tour = await tourService.createTourCompany(req.body, vendorId);

    res.status(201).json({
      success: true,
      message: "Tour company created successfully",
      data: tour,
    });
  } catch (error) {
    logger.error("Controller Error: createTourCompany", error);
    next(error);
  }
};
