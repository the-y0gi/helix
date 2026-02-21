const Favorite = require("./favorite.model");
const Hotel = require("../hotels/hotel.model");

exports.toggleFavorite = async (userId, itemId, itemType = "hotel") => {
  const existing = await Favorite.findOne({
    user: userId,
    itemId,
    itemType,
  });

  if (existing) {
    await existing.deleteOne();
    return { isFavorite: false };
  }

  await Favorite.create({
    user: userId,
    itemId,
    itemType,
  });

  return { isFavorite: true };
};

exports.getUserFavorites = async (userId, itemType = "hotel") => {
  return await Favorite.find({ user: userId, itemType })
    .select("itemId")
    .lean();
};



exports.getFavoritesSummary = async (userId) => {
  const favorites = await Favorite.find({
    user: userId,
    itemType: "hotel",
  }).select("itemId");

  const totalSaved = favorites.length;

  if (totalSaved === 0) {
    return {
      name: "My next trip",
      totalSaved: 0,
      coverImages: [],
    };
  }

  const hotelIds = favorites.map((fav) => fav.itemId);
  const hotels = await Hotel.find({
    _id: { $in: hotelIds },
  })
    .select("images")
    .limit(4)
    .lean();

  const coverImages = hotels
    .map((hotel) => hotel.images?.[0]?.url)
    .filter(Boolean);

  return {
    name: "My next trip",
    totalSaved,
    coverImages,
  };
};

exports.getMyTripFavorites = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const favorites = await Favorite.find({
    user: userId,
    itemType: "hotel",
  })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const hotelIds = favorites.map((fav) => fav.itemId);

  const hotels = await Hotel.find({
    _id: { $in: hotelIds },
    isActive: true,
  })
    .select("name city rating numReviews images")
    .lean();

  return hotels.map((hotel) => ({
    ...hotel,
    thumbnail: hotel.images?.[0]?.url || null,
    isFavorite: true,
  }));
};
