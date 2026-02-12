const Hotel = require("./hotel.model");
const RoomType = require("../rooms/roomType.model");
const logger = require("../../shared/utils/logger");
const mongoose = require("mongoose");
const cloudinary = require("../../shared/config/cloudinary");

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
    const {
      city,
      minRating,
      minPrice,
      maxPrice,
      amenities,
      minSize,
      maxSize,
      adults,
      children,
      lat,
      lng,
      maxDistance,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    //RoomType Filters
    const roomTypeFilter = { isActive: true };

    if (minPrice || maxPrice) {
      roomTypeFilter.basePrice = {};
      if (minPrice) roomTypeFilter.basePrice.$gte = Number(minPrice);
      if (maxPrice) roomTypeFilter.basePrice.$lte = Number(maxPrice);
    }

    if (minSize || maxSize) {
      roomTypeFilter.roomSizeSqm = {};
      if (minSize) roomTypeFilter.roomSizeSqm.$gte = Number(minSize);
      if (maxSize) roomTypeFilter.roomSizeSqm.$lte = Number(maxSize);
    }

    if (adults) {
      roomTypeFilter["capacity.adults"] = { $gte: Number(adults) };
    }

    if (children) {
      roomTypeFilter["capacity.children"] = { $gte: Number(children) };
    }

    if (amenities) {
      roomTypeFilter.amenities = { $all: amenities.split(",") };
    }

    const matchingRoomTypes =
      await RoomType.find(roomTypeFilter).select("hotelId");

    const hotelIds = matchingRoomTypes.map((rt) => rt.hotelId);

    // Hotel Filters
    const hotelFilter = {
      _id: { $in: hotelIds },
      isActive: true,
    };

    if (city) hotelFilter.city = city;
    if (minRating) hotelFilter.rating = { $gte: Number(minRating) };

    // Geo Filter
    if (lat && lng) {
      hotelFilter.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          $maxDistance: maxDistance ? Number(maxDistance) * 1000 : 100000,
        },
      };
    }

    const hotels = await Hotel.find(hotelFilter)
      .populate("vendorId", "businessName")
      .sort({ isFeatured: -1, rating: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return hotels;
  } catch (error) {
    throw error;
  }
};

// Get a single hotel by its ID
exports.getHotelById = async (hotelId, checkIn, checkOut) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const result = await Hotel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(hotelId),
        isActive: true,
      },
    },
    {
      $lookup: {
        from: "roomtypes",
        let: { hotelId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$hotelId", "$$hotelId"] },
              isActive: true,
            },
          },
          {
            $lookup: {
              from: "availabilities",
              let: { roomTypeId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$roomTypeId", "$$roomTypeId"] },
                    date: { $gte: startDate, $lt: endDate },
                  },
                },
              ],
              as: "availabilityData",
            },
          },
          {
            $addFields: {
              availableRooms: {
                $cond: [
                  { $gt: [{ $size: "$availabilityData" }, 0] },
                  { $min: "$availabilityData.availableRooms" },
                  0,
                ],
              },
              priceOverride: {
                $first: "$availabilityData.priceOverride",
              },
            },
          },
          {
            $addFields: {
              finalPrice: {
                $cond: [
                  { $ifNull: ["$priceOverride", false] },
                  "$priceOverride",
                  {
                    $cond: [
                      { $gt: ["$discountPrice", 0] },
                      "$discountPrice",
                      "$basePrice",
                    ],
                  },
                ],
              },
            },
          },
          {
            $project: {
              availabilityData: 0,
              priceOverride: 0,
            },
          },
        ],
        as: "roomTypes",
      },
    },
  ]);

  if (!result.length) throw new Error("Hotel not found");

  return result[0];
};

// Update hotel details
exports.updateHotel = async (hotelId, vendorId, updateData) => {
  try {
    const existingHotel = await Hotel.findOne({
      _id: hotelId,
      vendorId,
    });

    if (!existingHotel) throw new Error("Hotel not found or unauthorized");

    if (updateData.images && updateData.images.length > 0) {
      if (existingHotel.images?.length > 0) {
        for (const img of existingHotel.images) {
          await cloudinary.uploader.destroy(img.public_id, {
            resource_type: img.resource_type || "image",
          });
        }
      }
    }

    const updatedHotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, vendorId },
      updateData,
      { new: true, runValidators: true },
    );

    return updatedHotel;
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
