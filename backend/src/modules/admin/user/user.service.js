const mongoose = require("mongoose");
const User = require("../../auth/auth.model");
const Booking = require("../../bookings/booking.model");

exports.getAllUsers = async (query) => {
  try {
    const { page = 1, limit = 10, search, status } = query;

    const skip = (page - 1) * limit;

    const matchStage = {
      role: "user", //only normal users
    };

    //status filter (active / blocked)
    if (status === "active") matchStage.isActive = true;
    if (status === "blocked") matchStage.isActive = false;

    const pipeline = [
      {
        $match: matchStage,
      },

      // Search
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { firstName: { $regex: search, $options: "i" } },
                  { lastName: { $regex: search, $options: "i" } },
                  { email: { $regex: search, $options: "i" } },
                  { phoneNumber: { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      //Join bookings to count
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "userId",
          as: "bookings",
        },
      },

      {
        $addFields: {
          totalBookings: { $size: "$bookings" },
        },
      },

      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          avatar: 1,
          isActive: 1,
          createdAt: 1,
          totalBookings: 1,
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

    const result = await User.aggregate(pipeline);

    const users = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      users,
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

exports.getUserBookings = async (userId, query) => {
  try {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // Join Hotel
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

      {
        $project: {
          _id: 1,
          bookingReference: 1,

          serviceType: {
            $literal: "hotel",
          },

          name: {
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
          status: 1,
          paymentStatus: 1,

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

exports.getBookingDetail = async (userId, bookingId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(bookingId),
          userId: new mongoose.Types.ObjectId(userId),
        },
      },

      // Hotel
      {
        $lookup: {
          from: "hotels",
          localField: "hotelId",
          foreignField: "_id",
          as: "hotel",
        },
      },
      { $unwind: "$hotel" },

      // Vendor
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

      // Payment
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
          // BOOKING INFO
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

          //SERVICE
          service: {
            type: "hotel",

            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              rating: "$hotel.rating",
              numReviews: "$hotel.numReviews",
              isActive: "$hotel.isActive",
              verificationStatus: "$hotel.verificationStatus",
              image: { $arrayElemAt: ["$hotel.images.url", 0] },
            },

            room: {
              roomTypeId: "$roomTypeId",
              pricePerNight: "$pricePerNight",
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

          //PRICING
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

exports.updateUserStatus = async (userId, body) => {
  try {
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      throw new Error("isActive must be true or false");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true },
    ).select("_id firstName lastName email isActive");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      message: isActive
        ? "User unblocked successfully"
        : "User blocked successfully",
      user,
    };
  } catch (error) {
    throw error;
  }
};
