const express = require("express");
const router = express.Router();
const hotelController = require("./hotel.controller");
const { protect } = require("../../shared/middlewares/verifyToken");
const { authorize } = require("../../shared/middlewares/roleMiddleware");

//public routes
router.get("/", hotelController.getHotels);

router.get("/search", hotelController.searchHotels);

router.get("/nearby", hotelController.getNearbyHotels);
router.get("/:id", hotelController.getHotel);

//private: vendor routes
router.use(protect);

router.post("/", authorize("vendor"), hotelController.createHotel);

router.patch("/:id", authorize("vendor"), hotelController.updateHotel);

module.exports = router;
