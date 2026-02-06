const express = require("express");
const router = express.Router();
const vendorController = require("./vendor.controller");
const { protect } = require("../../shared/middlewares/verifyToken");

router.post("/register", protect, vendorController.setupVendorProfile);

module.exports = router;