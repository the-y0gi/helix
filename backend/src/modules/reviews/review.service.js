const Review = require("./review.model");
const Booking = require("../bookings/booking.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

//Create Review (only after completed booking)
exports.createReview = async (data) => {
  try {
    const { userId, hotelId, rating, breakdown, comment } = data;

    // ensure user has completed booking for this hotel
    const hasBooking = await Booking.findOne({
      userId,
      hotelId,
      status: "completed",
    });

    if (!hasBooking) {
      throw new Error("You can review only after completing a stay");
    }

    const review = await Review.create({
      userId,
      hotelId,
      rating,
      breakdown,
      comment,
    });

    // update hotel rating (simple avg – can be optimized later)
    const stats = await Review.aggregate([
      { $match: { hotelId } },
      {
        $group: {
          _id: "$hotelId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length) {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        numReviews: stats[0].count,
      });
    }

    return review;
  } catch (error) {
    logger.error("Service Error: createReview", error);
    throw error;
  }
};

//Get reviews of a hotel
exports.getHotelReviews = async (hotelId) => {
  try {
    return await Review.find({ hotelId })
      .populate("userId", "firstName lastName avatar")
      .sort("-createdAt")
      .lean();
  } catch (error) {
    logger.error("Service Error: getHotelReviews", error);
    throw error;
  }
};
