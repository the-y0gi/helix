const RoomType = require("./roomType.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");

exports.createRoomType = async (data) => {
  try {
    return await RoomType.create(data);
  } catch (error) {
    logger.error("Service Error: createRoomType", error);
    throw error;
  }
};

exports.getRoomTypesByHotel = async (hotelId) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  try {
    return await RoomType.find({
      hotelId,
      isActive: true,
    }).lean();
  } catch (error) {
    logger.error("Service Error: getRoomTypesByHotel", error);
    throw error;
  }
};

exports.updateRoomType = async (roomTypeId, hotelId, updateData) => {
  try {
    const roomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!roomType) throw new Error("Room type not found or unauthorized");

    return roomType;
  } catch (error) {
    logger.error("Service Error: updateRoomType", error);
    throw error;
  }
};
