const roomService = require("./room.service");
const logger = require("../../shared/utils/logger");

//Add a room to a hotel (Vendor only)
exports.addRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: room,
    });
  } catch (error) {
    logger.error("Controller Error: addRoom", error);
    next(error);
  }
};

//Fetch all room types for a specific hotel
exports.getHotelRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const rooms = await roomService.getRoomsByHotel(hotelId);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    logger.error("Controller Error: getHotelRooms", error);
    next(error);
  }
};

//Update room info.
exports.updateRoomInfo = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    logger.error("Controller Error: updateRoomInfo", error);
    next(error);
  }
};
