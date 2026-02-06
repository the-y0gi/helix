const Room = require("./room.model");
const logger = require("../../shared/utils/logger");


//Create a new room type for a specific hotel
exports.createRoom = async (roomData) => {
  try {
    return await Room.create(roomData);
  } catch (error) {
    logger.error("Service Error: createRoom", error);
    throw error;
  }
};

//Get all rooms belonging to a specific hotel
exports.getRoomsByHotel = async (hotelId) => {
  try {
    return await Room.find({ hotelId, isActive: true }).lean();
  } catch (error) {
    logger.error("Service Error: getRoomsByHotel", error);
    throw error;
  }
};

// Get a single room detail by ID
exports.getRoomById = async (id) => {
  try {
    const room = await Room.findById(id).lean();
    if (!room) throw new Error("Room type not found");
    return room;
  } catch (error) {
    logger.error("Service Error: getRoomById", error);
    throw error;
  }
};

//Update room details
exports.updateRoom = async (id, updateData) => {
  try {
    const room = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!room) throw new Error("Room not found");
    return room;
  } catch (error) {
    logger.error("Service Error: updateRoom", error);
    throw error;
  }
};