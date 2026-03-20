const mongoose = require("mongoose");
const Review = require("../../reviews/review.model");

exports.getAllReviews = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      rating,
      serviceType,
      hasReply,
    } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    // Rating filter
    if (rating) {
      matchStage.rating = Number(rating);
    }

    // Has reply filter
    if (hasReply === "true") {
      matchStage["vendorReply.message"] = { $exists: true, $ne: "" };
    }
    if (hasReply === "false") {
      matchStage["vendorReply.message"] = { $in: [null, ""] };
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // HOTEL (current service)
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

      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { "user.firstName": { $regex: search, $options: "i" } },
                  { "user.lastName": { $regex: search, $options: "i" } },
                  { "hotel.name": { $regex: search, $options: "i" } },
                  { "vendor.businessName": { $regex: search, $options: "i" } },
                  { "hotel.city": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      // FINAL RESPONSE
      {
        $project: {
          _id: 1,

          reviewId: "$_id",

          userName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ["$user.firstName", ""] },
                  " ",
                  { $ifNull: ["$user.lastName", ""] },
                ],
              },
            },
          },

          serviceType: {
            $literal: "hotel", // future extendable
          },

          serviceName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          city: {
            $ifNull: ["$hotel.city", "N/A"],
          },

          rating: 1,

          comment: {
            $substr: ["$comment", 0, 80],
          },

          hasReply: {
            $cond: [
              { $ifNull: ["$vendorReply.message", false] },
              true,
              false,
            ],
          },

          createdAt: 1,
        },
      },

      {
        $sort: { createdAt: -1 },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Review.aggregate(pipeline);

    const reviews = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      reviews,
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



exports.getReviewDetail = async (reviewId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reviewId),
        },
      },

      // USER
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // HOTEL
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: "$hotel" },

      // VENDOR
      {
        $lookup: {
          from: "vendors",
          localField: "hotel.vendorId",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true,
        },
      },

      // FINAL RESPONSE
      {
        $project: {
          //  REVIEW 
          review: {
            reviewId: "$_id",
            rating: "$rating",
            breakdown: "$breakdown",
            comment: "$comment",
            createdAt: "$createdAt",
          },

          // USER
          user: {
            _id: "$user._id",
            name: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$user.firstName", ""] },
                    " ",
                    { $ifNull: ["$user.lastName", ""] },
                  ],
                },
              },
            },
            email: "$user.email",
            phoneNumber: "$user.phoneNumber",
          },

          // SERVICE 
          service: {
            type: "hotel",

            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              image: { $arrayElemAt: ["$hotel.images.url", 0] },
            },
          },

          //VENDOR
          vendor: {
            _id: "$vendor._id",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
          },

          //VENDOR REPLY
          vendorReply: {
            message: "$vendorReply.message",
            repliedAt: "$vendorReply.repliedAt",
          },
        },
      },
    ];

    const result = await Review.aggregate(pipeline);

    if (!result.length) {
      throw new Error("Review not found");
    }

    return result[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    return {
      message: "Review deleted successfully",
    };
  } catch (error) {
    throw error;
  }
};



exports.getReviewStats = async () => {
  try {
    const pipeline = [
      {
        $facet: {
          //Total Reviews
          totalReviews: [
            {
              $count: "count",
            },
          ],

          //Average Rating
          avgRating: [
            {
              $group: {
                _id: null,
                avg: { $avg: "$rating" },
              },
            },
          ],

          //Low Ratings (1 & 2)
          lowRatings: [
            {
              $match: {
                rating: { $lte: 2 },
              },
            },
            {
              $count: "count",
            },
          ],

          //No Reply Reviews
          noReply: [
            {
              $match: {
                $or: [
                  { "vendorReply.message": null },
                  { "vendorReply.message": "" },
                ],
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await Review.aggregate(pipeline);

    const stats = result[0];

    return {
      totalReviews: stats.totalReviews[0]?.count || 0,
      avgRating: Number(stats.avgRating[0]?.avg?.toFixed(1)) || 0,
      lowRatings: stats.lowRatings[0]?.count || 0,
      noReply: stats.noReply[0]?.count || 0,
    };
  } catch (error) {
    throw error;
  }
};

exports.flagReview = async (reviewId, body) => {
  try {
    const { isFlagged = true, reason } = body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isFlagged,
        flagReason: reason || "Flagged by admin",
      },
      { new: true }
    );

    if (!review) {
      throw new Error("Review not found");
    }

    return {
      message: isFlagged
        ? "Review flagged successfully"
        : "Review unflagged successfully",
      review,
    };
  } catch (error) {
    throw error;
  }
};