const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./dashboard/dashboard.routes");
const bookingRoutes = require("./booking/booking.routes");
// const serviceRoutes = require("../services/service.routes");

router.use("/dashboard", dashboardRoutes);
router.use("/bookings", bookingRoutes);
// router.use("/services", serviceRoutes);

module.exports = router;