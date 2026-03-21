const express = require("express");
const router = express.Router();

const controller = require("./booking.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// User only
router.use(protect, authorize("user"));

router.post("/", controller.createBooking);

//booking cards
router.get("/my-bookings", controller.getMyBookings);

router.patch("/:id/cancel", controller.cancelBooking);

//refund preview and amount return sms
router.get("/:id/refund-preview", controller.getRefundPreview);

//detal booking
router.get("/:id", controller.getBookingById);

module.exports = router;
