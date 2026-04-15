const express = require("express");
const router = express.Router();
const bookingController = require("./booking.controller");
const { protect } = require("../../../shared/middlewares/verifyToken");
const { authorize } = require("../../../shared/middlewares/roleMiddleware");

router.use(protect);

router.get("/", protect, authorize("vendor"), bookingController.getUserBookings);

router.get("/:id", protect, authorize("vendor"), bookingController.getUserBookingById);

module.exports = router;
