const availabilityService = require("./availability.service");
const Vendor = require("../vendors/vendor.model");
const RoomType = require("../rooms/roomType.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

//Vendor: Set availability for a date
exports.setAvailability = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) throw new Error("Vendor profile not found");

    const roomType = await RoomType.findById(req.body.roomTypeId);
    if (!roomType) throw new Error("Room type not found");

    const hotel = await Hotel.findOne({
      _id: roomType.hotelId,
      vendorId: vendor._id,
    });

    if (!hotel) throw new Error("Unauthorized hotel access");

    const availability = await availabilityService.upsertAvailability(
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Availability updated",
      data: availability,
    });
  } catch (error) {
    logger.error("Controller Error: setAvailability", error);
    next(error);
  }
};

//User: Get availability calendar
exports.getAvailability = async (req, res, next) => {
  try {
    const { roomTypeId, startDate, endDate } = req.query;

    if (!roomTypeId || !startDate || !endDate) {
      throw new Error("roomTypeId, startDate and endDate are required");
    }

    const availability =
      await availabilityService.getAvailabilityForRange(
        roomTypeId,
        startDate,
        endDate,
      );

    res.status(200).json({
      success: true,
      count: availability.length,
      data: availability,
    });
  } catch (error) {
    logger.error("Controller Error: getAvailability", error);
    next(error);
  }
};
