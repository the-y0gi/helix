const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

router.use(protect);

router.post("/booking", protect, bookingController.createBooking);

router.post("/verify-payment", protect, bookingController.verifyPayment);

module.exports = router;
