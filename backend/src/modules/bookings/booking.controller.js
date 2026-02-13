const bookingService = require("./booking.service");
const logger = require("../../shared/utils/logger");

//Create Booking
exports.createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed",
      data: booking,
    });
  } catch (error) {
    logger.error("Controller Error: createBooking", error);
    next(error);
  }
};

//Get logged-in user's bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    logger.error("Controller Error: getMyBookings", error);
    next(err);
  }
};

//get booking detail by id
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingDetail(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};


//Cancel Booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    logger.error("Controller Error: cancelBooking", error);
    next(error);
  }
};

