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


// Get a single hotel by its ID (User Side)
exports.getHotelById = async (hotelId, checkIn, checkOut, adults, children) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new Error("Invalid hotel id");
  }

  const hasDates = checkIn && checkOut;

  let startDate, endDate, nights = 0;

  if (hasDates) {
    startDate = new Date(checkIn);
    endDate = new Date(checkOut);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate >= endDate) {
      throw new Error("Invalid check-in/check-out dates");
    }

    nights = (endDate - startDate) / (1000 * 60 * 60 * 24);
  }

  const pipeline = [
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
        ],
        as: "roomTypes",
      },
    },
  ];

  const result = await Hotel.aggregate(pipeline);

  if (!result.length) {
    throw new Error("Hotel not found");
  }

  const hotel = result[0];

  // If no dates → return all room types with default pricing
  if (!hasDates) {
    hotel.roomTypes = hotel.roomTypes.map((room) => ({
      ...room,
      availableRooms: room.totalRooms,
      finalPrice:
        room.discountPrice > 0 ? room.discountPrice : room.basePrice,
    }));

    return hotel;
  }

  // If dates exist → fetch availability separately
  const roomTypeIds = hotel.roomTypes.map((r) => r._id);

  const availabilityDocs = await mongoose.model("Availability").find({
    roomTypeId: { $in: roomTypeIds },
    date: { $gte: startDate, $lt: endDate },
  }).lean();

  const availabilityMap = {};

  for (const doc of availabilityDocs) {
    const key = doc.roomTypeId.toString();
    if (!availabilityMap[key]) {
      availabilityMap[key] = [];
    }
    availabilityMap[key].push(doc);
  }

  hotel.roomTypes = hotel.roomTypes
    .map((room) => {
      const roomAvailabilities = availabilityMap[room._id.toString()] || [];

      // Must have full date coverage
      if (roomAvailabilities.length !== nights) {
        return null;
      }

      const availableRooms = Math.min(
        ...roomAvailabilities.map((d) => d.availableRooms)
      );

      const priceOverride = roomAvailabilities[0]?.priceOverride;

      const finalPrice =
        priceOverride ??
        (room.discountPrice > 0
          ? room.discountPrice
          : room.basePrice);

      return {
        ...room,
        availableRooms,
        finalPrice,
        nights,
        totalPrice: finalPrice * nights,
      };
    })
    .filter((room) => room !== null);

  // Capacity filter (optional)
  if (adults) {
    hotel.roomTypes = hotel.roomTypes.filter(
      (room) =>
        room.capacity.adults >= adults &&
        room.capacity.children >= (children || 0)
    );
  }

  return hotel;
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


exports.searchHotels = async (query = {}) => {
  const {
    destination,
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    page = 1,
    limit = 10,
  } = query;

  if (!checkIn || !checkOut)
    throw new Error("checkIn and checkOut are required");

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const nights =
    (endDate - startDate) / (1000 * 60 * 60 * 24);

  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        isActive: true,
        ...(destination && { city: destination }),
      },
    },

    {
      $lookup: {
        from: "roomtypes",
        localField: "_id",
        foreignField: "hotelId",
        as: "roomTypes",
      },
    },

    { $unwind: "$roomTypes" },

    // Capacity filter
    {
      $match: {
        "roomTypes.capacity.adults": { $gte: Number(adults) },
        "roomTypes.capacity.children": { $gte: Number(children) },
        "roomTypes.isActive": true,
      },
    },

    {
      $lookup: {
        from: "availabilities",
        let: { roomTypeId: "$roomTypes._id" },
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

    // Ensure availability for ALL selected nights
    {
      $addFields: {
        validDateCount: { $size: "$availabilityData" },
        minAvailableRooms: {
          $cond: [
            { $gt: [{ $size: "$availabilityData" }, 0] },
            { $min: "$availabilityData.availableRooms" },
            0,
          ],
        },
      },
    },

    {
      $match: {
        validDateCount: nights,
        minAvailableRooms: { $gt: 0 },
      },
    },

    // Price calculation
    {
      $addFields: {
        effectivePrice: {
          $cond: [
            { $gt: ["$roomTypes.discountPrice", 0] },
            "$roomTypes.discountPrice",
            "$roomTypes.basePrice",
          ],
        },
      },
    },

    // Group back to hotel
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        city: { $first: "$city" },
        rating: { $first: "$rating" },
        numReviews: { $first: "$numReviews" },
        isFeatured: { $first: "$isFeatured" },
        images: { $first: "$images" },
        startingPrice: { $min: "$effectivePrice" },
        availableRooms: { $min: "$minAvailableRooms" },
      },
    },

    {
      $addFields: {
        totalNights: nights,
        totalPrice: { $multiply: ["$startingPrice", nights] },
        thumbnail: { $arrayElemAt: ["$images.url", 0] },
      },
    },

    {
      $project: {
        images: 0,
      },
    },

    { $sort: { isFeatured: -1, rating: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  return await Hotel.aggregate(pipeline);
};
