const express = require("express");
const router = express.Router();
const roomController = require("./room.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

//Get all room types for a specific hotel
router.get("/hotel/:hotelId", roomController.getHotelRooms);

router.use(protect);

//Add a new room type to a hotel
router.post("/", authorize("vendor"), roomController.addRoom);

// Update room details like price or availability
router.patch("/:id", authorize("vendor"), roomController.updateRoomInfo);

module.exports = router;
