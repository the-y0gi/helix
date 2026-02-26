const express = require("express");
const router = express.Router();
const hotelController = require("./hotel.controller");
const {
  protect,
  optionalProtect,
} = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

//public routes
router.get("/", optionalProtect, hotelController.getHotels);
router.get("/home", optionalProtect, hotelController.getHomeHotels);

router.get("/suggestions", hotelController.getSuggestions);
router.get("/search", optionalProtect, hotelController.searchHotels);

router.get("/nearby", hotelController.getNearbyHotels);
router.get("/:id", optionalProtect, hotelController.getHotelDetails);
router.get("/:id/availability", hotelController.getHotelAvailability);

//private: vendor routes
router.use(protect);

router.post("/", authorize("vendor"), hotelController.createHotel);

router.patch("/:id", authorize("vendor"), hotelController.updateHotel);

module.exports = router;
