const RoomType = require("./roomType.model");
const mongoose = require("mongoose");
const logger = require("../../shared/utils/logger");
const cloudinary = require("../../shared/config/cloudinary");

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
    const existingRoomType = await RoomType.findOne({
      _id: roomTypeId,
      hotelId,
    });

    if (!existingRoomType)
      throw new Error("Room type not found or unauthorized");

    if (updateData.images && updateData.images.length > 0) {
      if (existingRoomType.images?.length > 0) {
        for (const img of existingRoomType.images) {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: "auto",
          });
        }
      }
    }

    const updatedRoomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hotelId },
      updateData,
      { new: true, runValidators: true }
    );

    return updatedRoomType;
  } catch (error) {
    logger.error("Service Error: updateRoomType", error);
    throw error;
  }
};
