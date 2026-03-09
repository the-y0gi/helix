const Review = require("./review.model");
const Booking = require("../bookings/booking.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

const mongoose = require("mongoose");

//Create Review (only after completed booking)
exports.createReview = async (data) => {
  try {
    const { userId, hotelId, rating, breakdown, comment } = data;

    //ensure user has completed booking for this hotel
    const hasBooking = await Booking.findOne({
      userId,
      hotelId,
      status: "completed",
    });

    if (!hasBooking) {
      throw new Error("You can review only after completing a stay");
    }

    const existingReview = await Review.findOne({ userId, hotelId });

    if (existingReview) {
      throw new Error("You have already reviewed this hotel");
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

//Get vendor hotel reviews
exports.getVendorReviews = async (vendorId) => {
  try {
    const hotels = await Hotel.find({ vendorId }).select("_id");

    const hotelIds = hotels.map((h) => h._id);

    const stats = await Review.aggregate([
      {
        $match: {
          hotelId: {
            $in: hotelIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const comments = await Review.find({
      hotelId: { $in: hotelIds },
      comment: { $exists: true, $ne: "" },
    })
      .populate("userId", "firstName lastName avatar")
      .populate("hotelId", "name")
      .sort("-createdAt")
      .limit(20)
      .lean();

    return {
      averageRating: stats.length ? Number(stats[0].avgRating.toFixed(1)) : 0,
      totalReviews: stats.length ? stats[0].totalReviews : 0,
      comments,
    };
  } catch (error) {
    logger.error("Service Error: getVendorReviews", error);
    throw error;
  }
};

//review delete by vendor
exports.deleteReview = async (reviewId, vendorId) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    const hotel = await Hotel.findById(review.hotelId);

    if (!hotel || hotel.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Not authorized to delete this review");
    }

    await review.deleteOne();

    return true;
  } catch (error) {
    logger.error("Service Error: deleteReview", error);
    throw error;
  }
};

//review update
exports.updateReview = async (reviewId, userId, data) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userId.toString() !== userId.toString()) {
      throw new Error("Not authorized to edit this review");
    }

    review.rating = data.rating ?? review.rating;
    review.comment = data.comment ?? review.comment;
    review.breakdown = data.breakdown ?? review.breakdown;

    await review.save();

    return review;
  } catch (error) {
    logger.error("Service Error: updateReview", error);
    throw error;
  }
};

//vendor reply to user
exports.vendorReply = async (reviewId, vendorId, message) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    const hotel = await Hotel.findById(review.hotelId);

    if (!hotel || hotel.vendorId.toString() !== vendorId.toString()) {
      throw new Error("Not authorized");
    }

    review.vendorReply = {
      message,
      repliedAt: new Date(),
    };

    await review.save();

    return review;
  } catch (error) {
    logger.error("Service Error: vendorReply", error);
    throw error;
  }
};
