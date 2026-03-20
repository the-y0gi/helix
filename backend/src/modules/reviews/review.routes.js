const express = require("express");
const router = express.Router();
const controller = require("./review.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const {authorize} = require("../../shared/middlewares/roleMiddleware")
// Public
router.get("/hotel/:hotelId", controller.getHotelReviews);

// User
//get
router.get(
  "/",
  protect,
  controller.getUserReviewBookings
);
router.post("/", protect, controller.createReview);
router.put("/:reviewId", protect, controller.updateReview);

// Vendor
router.get("/vendor", protect, authorize("vendor"), controller.getVendorReviews);

router.delete(
  "/vendor/:reviewId",
  protect,
  authorize("vendor"),
  controller.deleteReview
);

router.post(
  "/vendor/reply/:reviewId",
  protect,
  authorize("vendor"),
  controller.vendorReply
);

module.exports = router;