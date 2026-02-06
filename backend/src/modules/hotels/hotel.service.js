const Hotel = require("./hotel.model");
const logger = require("../../shared/utils/logger");

// Create a new hotel
exports.createHotel = async (hotelData) => {
  try {
    return await Hotel.create(hotelData);
  } catch (error) {
    logger.error("Service Error: createHotel", error);
    throw error;
  }
};

// Get all hotels
exports.getAllHotels = async (filters = {}) => {
  try {
    return await Hotel.find({ ...filters, isActive: true })
      .populate("vendorId", "businessName")
      .sort("-createdAt")
      .lean();
  } catch (error) {
    logger.error("Service Error: getAllHotels", error);
    throw error;
  }
};

// Get a single hotel by its ID
exports.getHotelById = async (id) => {
  try {
    const hotel = await Hotel.findById(id).populate("vendorId").lean();
    if (!hotel) throw new Error("Hotel not found");
    return hotel;
  } catch (error) {
    logger.error("Service Error: getHotelById", error);
    throw error;
  }
};

// Update hotel details
exports.updateHotel = async (id, updateData) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!hotel) throw new Error("Hotel not found");
    return hotel;
  } catch (error) {
    logger.error("Service Error: updateHotel", error);
    throw error;
  }
};

// Find hotels near a specific location (Geospatial Search)
exports.findNearbyHotels = async (lng, lat, maxDistance = 5000) => {
  try {
    return await Hotel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    }).lean();
  } catch (error) {
    logger.error("Service Error: findNearbyHotels", error);
    throw error;
  }
};
