const reviewService = require("./review.service");
const logger = require("../../shared/utils/logger");

//Create review
exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Controller Error: createReview", error);
    next(error);
  }
};

//Get hotel reviews
exports.getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getHotelReviews(req.params.hotelId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    logger.error("Controller Error: getHotelReviews", error);
    next(error);
  }
};
