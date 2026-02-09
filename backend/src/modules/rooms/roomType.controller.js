const roomTypeService = require("./roomType.service");
const Vendor = require("../vendors/vendor.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

exports.createRoomType = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) throw new Error("Vendor profile not found");

    const hotel = await Hotel.findOne({
      _id: req.body.hotelId,
      vendorId: vendor._id,
    });

    if (!hotel) throw new Error("Unauthorized hotel access");

    const roomType = await roomTypeService.createRoomType(req.body);

    res.status(201).json({
      success: true,
      message: "Room type created successfully",
      data: roomType,
    });
  } catch (error) {
    logger.error("Controller Error: createRoomType", error);
    next(error);
  }
};

exports.getRoomTypesByHotel = async (req, res, next) => {
  try {
    const roomTypes = await roomTypeService.getRoomTypesByHotel(
      req.params.hotelId,
    );

    res.status(200).json({
      success: true,
      count: roomTypes.length,
      data: roomTypes,
    });
  } catch (error) {
    logger.error("Controller Error: getRoomTypesByHotel", error);
    next(error);
  }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) throw new Error("Vendor profile not found");

    const roomType = await roomTypeService.updateRoomType(
      req.params.id,
      req.body.hotelId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Room type updated successfully",
      data: roomType,
    });
  } catch (error) {
    logger.error("Controller Error: updateRoomType", error);
    next(error);
  }
};
