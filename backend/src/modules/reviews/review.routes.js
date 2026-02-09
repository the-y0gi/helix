const express = require("express");
const router = express.Router();
const controller = require("./review.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

// Public
router.get("/hotel/:hotelId", controller.getHotelReviews);

// User
router.use(protect);
router.post("/", controller.createReview);

module.exports = router;
