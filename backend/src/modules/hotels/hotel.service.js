const Hotel = require("./hotel.model");
const RoomType = require("../rooms/roomType.model");
const logger = require("../../shared/utils/logger");
const mongoose = require("mongoose");
const cloudinary = require("../../shared/config/cloudinary");
const Booking = require("../bookings/booking.model");

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


// Get a single hotel detail by id
exports.getHotelDetails = async (hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
  }).lean();

  if (!hotel) throw new Error("Hotel not found");

  const roomTypes = await RoomType.find({
    hotelId,
    isActive: true,
  }).lean();

  return {
    ...hotel,
    roomTypes: roomTypes.map((room) => ({
      ...room,
      displayPrice:
        room.discountPrice > 0 ? room.discountPrice : room.basePrice,
    })),
  };
};

//availabile rooms in hotel
exports.getHotelAvailability = async (
  hotelId,
  checkIn,
  checkOut,
  adults,
  children
) => {
  if (!checkIn || !checkOut)
    throw new Error("Check-in and check-out required");

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (startDate >= endDate)
    throw new Error("Invalid date range");

  const nights =
    (endDate - startDate) / (1000 * 60 * 60 * 24);

  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
  }).lean();

  if (!hotel) throw new Error("Hotel not found");

  const roomTypes = await RoomType.find({
    hotelId,
    isActive: true,
  }).lean();

  const results = [];

  for (const room of roomTypes) {
    let minAvailable = room.totalRooms;
    let totalPrice = 0;
    let isAvailable = true;

    for (let i = 0; i < nights; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Sum booked rooms
      const booked = await Booking.aggregate([
        {
          $match: {
            roomTypeId: room._id,
            status: { $in: ["confirmed", "pending"] },
            checkIn: { $lte: date },
            checkOut: { $gt: date },
          },
        },
        {
          $group: {
            _id: null,
            totalBooked: { $sum: "$roomsBooked" },
          },
        },
      ]);

      const bookedCount = booked[0]?.totalBooked || 0;

      const available =
        room.totalRooms - bookedCount;

      if (available <= 0) {
        isAvailable = false;
        break;
      }

      minAvailable = Math.min(minAvailable, available);

      const price =
        room.discountPrice > 0
          ? room.discountPrice
          : room.basePrice;

      totalPrice += price;
    }

    if (!isAvailable) continue;

    if (adults || children) {
      if (
        room.capacity.adults < adults ||
        room.capacity.children < (children || 0)
      ) {
        continue;
      }
    }

    results.push({
      ...room,
      availableRooms: minAvailable,
      nights,
      totalPrice,
    });
  }

  return {
    // ...hotel,
    roomTypes: results,
  };
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
