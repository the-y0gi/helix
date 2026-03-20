const mongoose = require("mongoose");
const Booking = require("../../bookings/booking.model");

exports.getBookingStats = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $facet: {
          totalBookings: [
            {
              $count: "count",
            },
          ],
          todaysBookings: [
            {
              $match: {
                createdAt: {
                  $gte: todayStart,
                  $lte: todayEnd,
                },
              },
            },
            {
              $count: "count",
            },
          ],
          pendingPayments: [
            {
              $match: {
                paymentStatus: "pending",
              },
            },
            {
              $count: "count",
            },
          ],
          cancellations: [
            {
              $match: {
                status: "cancelled",
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);

    const stats = result[0];

    return {
      totalBookings: stats.totalBookings[0]?.count || 0,
      todaysBookings: stats.todaysBookings[0]?.count || 0,
      pendingPayments: stats.pendingPayments[0]?.count || 0,
      cancellations: stats.cancellations[0]?.count || 0,
    };
  } catch (error) {
    throw error;
  }
};

exports.getAllBookings = async (query) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      serviceType,
    } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    if (paymentStatus) {
      matchStage.paymentStatus = paymentStatus;
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      //Join User
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      //Join Hotel
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

      //Dynamic Status Calculation
      {
        $addFields: {
          computedStatus: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "cancelled"] },
                  then: "cancelled",
                },
                {
                  case: { $gt: ["$checkIn", new Date()] },
                  then: "upcoming",
                },
                {
                  case: {
                    $and: [
                      { $lte: ["$checkIn", new Date()] },
                      { $gte: ["$checkOut", new Date()] },
                    ],
                  },
                  then: "ongoing",
                },
                {
                  case: { $lt: ["$checkOut", new Date()] },
                  then: "completed",
                },
              ],
              default: "pending",
            },
          },
        },
      },

      // Status filter
      ...(status
        ? [
            {
              $match: {
                computedStatus: status,
              },
            },
          ]
        : []),

      // Search
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { bookingReference: { $regex: search, $options: "i" } },
                  { "user.firstName": { $regex: search, $options: "i" } },
                  { "user.lastName": { $regex: search, $options: "i" } },
                  { "hotel.name": { $regex: search, $options: "i" } },
                  { "hotel.city": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,
          bookingReference: 1,

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
            $literal: "hotel", // future extendable add cab,adventure
          },

          serviceName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          city: {
            $ifNull: ["$hotel.city", "N/A"],
          },

          checkIn: 1,
          checkOut: 1,
          createdAt: 1,

          totalAmount: 1,
          paymentStatus: 1,

          status: "$computedStatus",
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

exports.getBookingDetail = async (bookingId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),
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
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
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

      // PAYMENT
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "bookingId",
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          //BOOKING INFO
          bookingInfo: {
            bookingId: "$_id",
            bookingReference: "$bookingReference",
            status: "$status",
            paymentStatus: "$paymentStatus",

            checkIn: "$checkIn",
            checkOut: "$checkOut",
            nights: "$nights",
            createdAt: "$createdAt",

            guests: "$guests",
            primaryGuest: "$primaryGuest",
            additionalGuests: "$additionalGuests",

            specialRequest: "$specialRequest",
            roomNumber: "$roomNumber",

            cancellation: {
              cancelledAt: "$cancelledAt",
              cancellationReason: "$cancellationReason",
            },

            refund: {
              refundStatus: "$refundStatus",
              refundAmount: "$refundAmount",
              refundPercentage: "$refundPercentage",
              refundRequestedAt: "$refundRequestedAt",
              refundProcessedAt: "$refundProcessedAt",
            },
          },

          //user
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

          //service
          service: {
            type: "hotel",

            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              verificationStatus: "$hotel.verificationStatus",
              image: { $arrayElemAt: ["$hotel.images.url", 0] },
            },

            room: {
              roomTypeId: "$roomTypeId",
              pricePerNight: "$pricePerNight",
            },
          },

          //vendor info
          vendor: {
            _id: "$vendor._id",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
            isActive: "$vendor.isActive",
          },

          //PAYMENT
          payment: {
            _id: "$payment._id",
            razorpayOrderId: "$payment.razorpayOrderId",
            razorpayPaymentId: "$payment.razorpayPaymentId",
            amountPaid: "$payment.amountPaid",
            currency: "$payment.currency",
            paymentMethod: "$payment.paymentMethod",
            status: "$payment.status",
            isVerified: "$payment.isVerified",

            refund: {
              refundAmount: "$payment.refundAmount",
              refundStatus: "$payment.refundStatus",
              refundedAt: "$payment.refundedAt",
            },
          },

          //pricing
          pricing: {
            pricePerNight: "$pricePerNight",
            nights: "$nights",
            roomsBooked: "$roomsBooked",

            taxAmount: "$taxAmount",
            cleaningFee: "$cleaningFee",
            discountAmount: "$discountAmount",

            totalAmount: "$totalAmount",
          },
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);

    if (!result.length) {
      throw new Error("Booking not found");
    }

    return result[0];
  } catch (error) {
    throw error;
  }
};
