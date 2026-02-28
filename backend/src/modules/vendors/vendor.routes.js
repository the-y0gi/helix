const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const bookingController = require("../bookings/booking.controller");
const hotelController = require("../hotels/hotel.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

// Vendor profile
router.post("/register", protect, vendorController.setupVendorProfile);

// Bookings
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

router.patch(
  "/bookings/:id/refund",
  protect,
  authorize("admin"),
  bookingController.handleRefund,
);

// Room Types
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

// Hotels
router.post(
  "/hotels",
  protect,
  authorize("vendor"),
  hotelController.createHotel,
);

router.patch(
  "/hotels/:id",
  protect,
  authorize("vendor"),
  hotelController.updateHotel,
);

//invoice
router.get(
  "/invoices",
  protect,
  authorize("vendor"),
  vendorController.getVendorInvoices
);

router.get(
  "/invoices/:bookingId/download",
  protect,
  authorize("vendor"),
  vendorController.downloadInvoicePdf
);

module.exports = router;
