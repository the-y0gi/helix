const bookingService = require("./booking.service");
const logger = require("../../../shared/utils/logger");

exports.getUserBookings = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const result = await bookingService.getUserBookings(
      req.query,
      vendorId
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBookings", error);
    next(error);
  }
};

exports.getUserBookingById = async (req, res, next) => {
  try {
    const vendorId = req.user._id;
    const bookingId = req.params.id;

    const booking = await bookingService.getUserBookingById(
      bookingId,
      vendorId
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorBookingDetail", error);
    next(error);
  }
};