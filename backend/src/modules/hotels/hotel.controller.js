const hotelService = require("./hotel.service");
const logger = require("../../shared/utils/logger");
const Vendor = require("../vendors/vendor.model");

// Create a new hotel
exports.createHotel = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) {
      throw new Error("Vendor profile not found");
    }

    const hotelData = {
      ...req.body,
      vendorId: vendor._id,
    };

    const hotel = await hotelService.createHotel(hotelData);

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: hotel,
    });
  } catch (error) {
    logger.error("Controller Error: createHotel", error);
    next(error);
  }
};

// Get all hotels with filtering and pagination support
exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.getAllHotels(req.query);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    logger.error("Controller Error: getHotels", error);
    next(error);
  }
};

//Get a single hotel by ID for the details page
exports.getHotel = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;

    const hotel = await hotelService.getHotelById(
      req.params.id,
      checkIn,
      checkOut
    );

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// Update hotel details (Only for the owner vendor)
exports.updateHotel = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });

    if (!vendor) throw new Error("Vendor profile not found");

    const hotel = await hotelService.updateHotel(
      req.params.id,
      vendor._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: hotel,
    });
  } catch (error) {
    logger.error("Controller Error: updateHotel", error);
    next(error);
  }
};


// Search nearby hotels based on coordinates (Geospatial API)
exports.getNearbyHotels = async (req, res, next) => {
  try {
    const { lng, lat, distance } = req.query;

    if (!lng || !lat) {
      throw new Error("Please provide longitude and latitude");
    }

    const hotels = await hotelService.findNearbyHotels(
      Number(lng),
      Number(lat),
      Number(distance) || 5000, // Default 5km
    );

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    logger.error("Controller Error: getNearbyHotels", error);
    next(error);
  }
};
