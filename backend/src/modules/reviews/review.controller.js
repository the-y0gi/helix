const reviewService = require("./review.service");
const logger = require("../../shared/utils/logger");

//get review card
exports.getUserReviewBookings = async (req, res, next) => {
  try {
    const result = await reviewService.getUserReviewBookings(
      req.user._id,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Controller Error: getUserReviewBookings", error);
    next(error);
  }
};
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

// Vendor reviews
exports.getVendorReviews = async (req, res, next) => {
  try {
    const vendorId = req.user._id;

    const reviews = await reviewService.getVendorReviews(vendorId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    logger.error("Controller Error: getVendorReviews", error);
    next(error);
  }
};

//delete reviews
exports.deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.reviewId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error: deleteReview", error);
    next(error);
  }
};

exports.vendorReply = async (req, res, next) => {
  try {
    const review = await reviewService.vendorReply(
      req.params.reviewId,
      req.user._id,
      req.body.message,
    );

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Controller Error: vendorReply", error);
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.reviewId,
      req.user._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Controller Error: updateReview", error);
    next(error);
  }
};
