const Vendor = require("../vendors/vendor.model");
const bookingService = require("../bookings/booking.service");
const roomTypeService = require("../rooms/roomType.service");

const vendorService = require("./vendor.service");
const logger = require("../../shared/utils/logger");

exports.setupVendorProfile = async (req, res, next) => {
  try {
    const vendorData = {
      userId: req.user._id,
      businessName: req.body.businessName,
      //approved for the testing purpose
      status: "approved",
    };

    const vendor = await vendorService.registerVendor(vendorData);

    res.status(201).json({
      success: true,
      message: "Vendor profile created and approved for testing",
      data: vendor,
    });
  } catch (error) {
    logger.error("Controller Error: setupVendorProfile", error);
    next(error);
  }
};


//get booking list in dashboard-vendor
exports.getVendorBookings = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await bookingService.getVendorBookings(
      vendor._id,
      req.query,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Vendor Booking List Error:", error);
    next(error);
  }
};

//get booking detail in dashboard-vendor
exports.getVendorBookingDetail = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const booking = await bookingService.getVendorBookingDetail(
      req.params.id,
      vendor._id
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error("Vendor Booking Detail Error:", error);
    next(error);
  }
};


//get in dashboardroom type controller
exports.getVendorRoomTypes = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await roomTypeService.getVendorRoomTypes(
      vendor._id,
      req.query
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error("Vendor RoomType List Error:", error);
    next(error);
  }
};

//get room type detail in dashboard-vendor
exports.getVendorRoomTypeDetail = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor || vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor not approved or not found",
      });
    }

    const result = await roomTypeService.getVendorRoomTypeDetail(
      req.params.id,
      vendor._id
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Vendor RoomType Detail Error:", error);
    next(error);
  }
};