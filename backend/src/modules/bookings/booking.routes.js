const express = require("express");
const router = express.Router();
const controller = require("./booking.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const {authorize} = require("../../shared/middlewares/roleMiddleware");
// User only
router.use(protect);

router.post("/", controller.createBooking);
router.get("/my-bookings", controller.getMyBookings);
router.get("/:id", controller.getBookingById);
router.patch("/:id/cancel", controller.cancelBooking);

module.exports = router;
