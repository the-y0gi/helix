const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

router.post("/register", protect, vendorController.setupVendorProfile);

router.get(
  "/bookings",
  protect,
  authorize("vendor"),
  vendorController.getVendorBookings,
);
router.get(
  "/bookings/:id",
  protect,
  authorize("vendor"),
  vendorController.getVendorBookingDetail,
);

router.get(
  "/room-types",
  protect,
  authorize("vendor"),
  vendorController.getVendorRoomTypes,
);

router.get(
  "/room-types/:id",
  protect,
  authorize("vendor"),
  vendorController.getVendorRoomTypeDetail,
);
module.exports = router;
