const Hotel = require("./hotel.model");
const RoomType = require("../rooms/roomType.model");
const logger = require("../../shared/utils/logger");
const mongoose = require("mongoose");
const cloudinary = require("../../shared/config/cloudinary");
const Booking = require("../bookings/booking.model");
const Favorite = require("../favorites/favorite.model");

//helper function to attach isFavorite flag to hotels
const attachFavoriteFlag = async (hotels, userId) => {
  if (!userId || hotels.length === 0) {
    hotels.forEach((hotel) => (hotel.isFavorite = false));
    return hotels;
  }

  const hotelIds = hotels.map((h) => h._id);

  const favorites = await Favorite.find({
    user: userId,
    itemType: "hotel",
    itemId: { $in: hotelIds },
  }).select("itemId");

  const favoriteSet = new Set(favorites.map((fav) => fav.itemId.toString()));

  hotels.forEach((hotel) => {
    hotel.isFavorite = favoriteSet.has(hotel._id.toString());
  });

  return hotels;
};

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
// exports.getAllHotels = async (query = {}, userId = null) => {
//   try {
//     const {
//       city,
//       minRating,
//       minPrice,
//       maxPrice,
//       amenities,
//       minSize,
//       maxSize,
//       adults,
//       children,
//       lat,
//       lng,
//       maxDistance,
//       page = 1,
//       limit = 10,
//     } = query;

//     const skip = (page - 1) * limit;

//     //RoomType Filters
//     const roomTypeFilter = { isActive: true };

//     if (minPrice || maxPrice) {
//       roomTypeFilter.basePrice = {};
//       if (minPrice) roomTypeFilter.basePrice.$gte = Number(minPrice);
//       if (maxPrice) roomTypeFilter.basePrice.$lte = Number(maxPrice);
//     }

//     if (minSize || maxSize) {
//       roomTypeFilter.roomSizeSqm = {};
//       if (minSize) roomTypeFilter.roomSizeSqm.$gte = Number(minSize);
//       if (maxSize) roomTypeFilter.roomSizeSqm.$lte = Number(maxSize);
//     }

//     if (adults) {
//       roomTypeFilter["capacity.adults"] = { $gte: Number(adults) };
//     }

//     if (children) {
//       roomTypeFilter["capacity.children"] = { $gte: Number(children) };
//     }

//     if (amenities) {
//       roomTypeFilter.amenities = { $all: amenities.split(",") };
//     }

//     const matchingRoomTypes =
//       await RoomType.find(roomTypeFilter).select("hotelId");

//     const hotelIds = matchingRoomTypes.map((rt) => rt.hotelId);

//     // Hotel Filters
//     const hotelFilter = {
//       _id: { $in: hotelIds },
//       isActive: true,
//     };

//     if (city) hotelFilter.city = city;
//     if (minRating) hotelFilter.rating = { $gte: Number(minRating) };

//     // Geo Filter
//     if (lat && lng) {
//       hotelFilter.location = {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [Number(lng), Number(lat)],
//           },
//           $maxDistance: maxDistance ? Number(maxDistance) * 1000 : 100000,
//         },
//       };
//     }

//     const hotels = await Hotel.find(hotelFilter)
//       .populate("vendorId", "businessName")
//       .sort({ isFeatured: -1, rating: -1 })
//       .skip(skip)
//       .limit(Number(limit))
//       .lean();

//     //add favorite flag to hotels
//     return await attachFavoriteFlag(hotels, userId);

//     // return hotels;
//   } catch (error) {
//     throw error;
//   }
// };
exports.getAllHotels = async (query = {}, userId = null) => {
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

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    //roomType filter
    const roomTypeFilter = { isActive: true };

    //Capacity
    if (adults) {
      roomTypeFilter["capacity.adults"] = { $gte: Number(adults) };
    }

    if (children) {
      roomTypeFilter["capacity.children"] = { $gte: Number(children) };
    }

    // room-size
    if (minSize || maxSize) {
      roomTypeFilter.roomSizeSqm = {};
      if (minSize) roomTypeFilter.roomSizeSqm.$gte = Number(minSize);
      if (maxSize) roomTypeFilter.roomSizeSqm.$lte = Number(maxSize);
    }

    //Effective Price Filter
    if (minPrice || maxPrice) {
      const priceCondition = [];

      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;

      //Discounted rooms
      priceCondition.push({
        discountPrice: { $gt: 0, $gte: min, $lte: max },
      });

      //Non-discount rooms
      priceCondition.push({
        discountPrice: 0,
        basePrice: { $gte: min, $lte: max },
      });

      roomTypeFilter.$or = priceCondition;
    }

    //Amenities on roomType
    if (amenities) {
      const amenityArray = amenities.split(",");
      roomTypeFilter.amenities = { $all: amenityArray };
    }

    //Get distinct hotelIds efficiently
    const hotelIds = await RoomType.distinct("hotelId", roomTypeFilter);

    if (hotelIds.length === 0) {
      return [];
    }

    //hotel filter
    const hotelFilter = {
      _id: { $in: hotelIds },
      isActive: true,
    };

    if (city) hotelFilter.city = city;
    if (minRating) hotelFilter.rating = { $gte: Number(minRating) };

    //Amenities on Hotel level
    if (amenities) {
      const amenityArray = amenities.split(",");
      hotelFilter.amenities = { $all: amenityArray };
    }

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
      .limit(limitNum)
      .lean();

    return await attachFavoriteFlag(hotels, userId);
  } catch (error) {
    throw error;
  }
};

// Get a single hotel detail by id
exports.getHotelDetails = async (hotelId, userId = null) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true,
  }).lean();

  if (!hotel) throw new Error("Hotel not found");

  const roomTypes = await RoomType.find({
    hotelId,
    isActive: true,
  }).lean();

  let isFavorite = false;

  if (userId) {
    const favorite = await Favorite.findOne({
      user: userId,
      itemType: "hotel",
      itemId: hotel._id,
    }).select("_id");

    isFavorite = !!favorite;
  }

  return {
    ...hotel,
    isFavorite,
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
  children,
) => {
  if (!checkIn || !checkOut) throw new Error("Check-in and check-out required");

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (startDate >= endDate) throw new Error("Invalid date range");

  const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

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

      const available = room.totalRooms - bookedCount;

      if (available <= 0) {
        isAvailable = false;
        break;
      }

      minAvailable = Math.min(minAvailable, available);

      const price =
        room.discountPrice > 0 ? room.discountPrice : room.basePrice;

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

exports.getSuggestions = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = await Hotel.find(
    {
      $text: { $search: query },
      isActive: true,
    },
    {
      score: { $meta: "textScore" },
      name: 1,
      city: 1,
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(8)
    .lean();

  // Unique city suggestions
  const uniqueCities = [
    ...new Set(results.map((hotel) => hotel.city)),
  ].slice(0, 3);

  const citySuggestions = uniqueCities.map((city) => ({
    type: "city",
    value: city,
  }));

  const hotelSuggestions = results.map((hotel) => ({
    type: "hotel",
    id: hotel._id,
    name: hotel.name,
    city: hotel.city,
  }));

  return [...citySuggestions, ...hotelSuggestions];
};

exports.searchHotels = async (query = {}, userId = null) => {
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

  const nights = (endDate - startDate) / (1000 * 60 * 60 * 24);

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

  const hotels = await Hotel.aggregate(pipeline);
  const updatedHotels = await attachFavoriteFlag(hotels, userId);
  return updatedHotels;
};
