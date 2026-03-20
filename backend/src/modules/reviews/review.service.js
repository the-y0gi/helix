const mongoose = require("mongoose");
const Review = require("./review.model");
const Booking = require("../bookings/booking.model");
const Hotel = require("../hotels/hotel.model");
const logger = require("../../shared/utils/logger");

//review card, comment and vendor reply
exports.getUserReviewBookings = async (userId, query) => {
  try {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "completed",
          checkOut: { $lt: new Date() },
        },
      },

      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      {
        $unwind: {
          path: "$hotel",
          preserveNullAndEmptyArrays: true,
        },
      },

      // REVIEW JOIN
      // {
      //   $lookup: {
      //     from: "reviews",
      //     let: { hotelId: "$hotelId", userId: "$userId" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$hotelId", "$$hotelId"] },
      //               { $eq: ["$userId", "$$userId"] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "reviewData",
      //   },
      // },
      {
        $lookup: {
          from: "reviews",
          let: { hotelId: "$hotelId", userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$hotelId", "$$hotelId"],
                    },
                    {
                      $eq: ["$userId", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "reviewData",
        },
      },
      {
        $unwind: {
          path: "$reviewData",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          bookingReference: 1,
          hotelId: 1,

          hotelName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          city: {
            $ifNull: ["$hotel.city", "N/A"],
          },

          image: {
            $arrayElemAt: ["$hotel.images.url", 0],
          },

          checkIn: 1,
          checkOut: 1,
          totalAmount: 1,

          hasReviewed: {
            $cond: [{ $ifNull: ["$reviewData._id", false] }, true, false],
          },

          review: {
            rating: "$reviewData.rating",
            comment: "$reviewData.comment",
            breakdown: "$reviewData.breakdown",
            createdAt: "$reviewData.createdAt",
          },

          vendorReply: {
            message: "$reviewData.vendorReply.message",
            repliedAt: "$reviewData.vendorReply.repliedAt",
          },
        },
      },

      {
        $sort: { checkOut: -1 },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);

    const bookings = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Create Review (only after completed booking)
exports.createReview = async (data) => {
  try {
    const { userId, hotelId, rating, breakdown, comment } = data;

    if (!hotelId) {
      throw new Error("Hotel ID is required");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const hasBooking = await Booking.findOne({
      userId,
      hotelId,
      status: "completed",
      checkOut: { $lt: new Date() }, // ensure stay completed
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
      breakdown: breakdown || {},
      comment: comment?.trim() || "",
    });

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
