const Hotel = require("./hotel.model");
const logger = require("../../shared/utils/logger");
const mongoose = require("mongoose");

// Create a new hotel
exports.createHotel = async (hotelData) => {
  try {
    return await Hotel.create(hotelData);
  } catch (error) {
    logger.error("Service Error: createHotel", error);
    throw error;
  }
};

// Get all hotels Supports filters, city, featured, rating
exports.getAllHotels = async (query = {}) => {
  try {
    const filters = { isActive: true };

    if (query.city) filters.city = query.city;
    if (query.isFeatured) filters.isFeatured = query.isFeatured;
    if (query.minRating) filters.rating = { $gte: Number(query.minRating) };

    return await Hotel.find(filters)
      .populate("vendorId", "businessName")
      .sort({ isFeatured: -1, rating: -1 })
      .lean();
  } catch (error) {
    logger.error("Service Error: getAllHotels", error);
    throw error;
  }
};

// Get a single hotel by its ID
exports.getHotelById = async (hotelId) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  try {
    const hotel = await Hotel.findOne({
      _id: hotelId,
      isActive: true,
    })
      .populate("vendorId", "businessName")
      .lean();

    if (!hotel) throw new Error("Hotel not found");

    return hotel;
  } catch (error) {
    logger.error("Service Error: getHotelById", error);
    throw error;
  }
};
// Update hotel details
exports.updateHotel = async (hotelId, vendorId, updateData) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, vendorId },
      updateData,
      { new: true, runValidators: true },
    );

    if (!hotel) throw new Error("Hotel not found or unauthorized");

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
      isActive: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    })
      .limit(50)
      .lean();
  } catch (error) {
    logger.error("Service Error: findNearbyHotels", error);
    throw error;
  }
};
