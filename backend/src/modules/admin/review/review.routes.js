const express = require("express");
const router = express.Router();

const reviewController = require("./review.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");


// Get review stats
router.get(
  "/stats",
  protect,
  authorize("admin"),
  reviewController.getReviewStats
);

// Get all reviews (admin)
router.get(
  "/",
  protect,
  authorize("admin"),
  reviewController.getAllReviews
);

// Get review detail
router.get(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.getReviewDetail
);

// Delete review
router.delete(
  "/:reviewId",
  protect,
  authorize("admin"),
  reviewController.deleteReview
);

// Flag review
router.patch(
  "/:reviewId/flag",
  protect,
  authorize("admin"),
  reviewController.flagReview
);

module.exports = router;