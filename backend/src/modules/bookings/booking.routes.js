const express = require("express");
const router = express.Router();
const controller = require("./booking.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

// User only
router.use(protect);

router.post("/", controller.createBooking);
router.get("/me", controller.getMyBookings);
router.patch("/:id/cancel", controller.cancelBooking);

module.exports = router;
