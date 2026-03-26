const mongoose = require("mongoose");
const Payment = require("../../payments/payment.model");

const Booking = require("../../bookings/booking.model");
const Availability = require("../../availability/availability.model");
const razorpay = require("../../../shared/config/razorpay");

exports.getAllPayments = async (query) => {
  try {
    const { page = 1, limit = 10, search, status, paymentMethod } = query;

    const skip = (page - 1) * limit;

    const matchStage = {};

    // Payment status filter
    if (status) {
      matchStage.status = status;
    }

    if (paymentMethod) {
      matchStage.paymentMethod = paymentMethod;
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      // BOOKING
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },

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
          localField: "booking.hotelId",
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
                  { razorpayPaymentId: { $regex: search, $options: "i" } },
                  {
                    "booking.bookingReference": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  { "user.firstName": { $regex: search, $options: "i" } },
                  { "user.lastName": { $regex: search, $options: "i" } },
                  { "hotel.name": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,

          paymentId: "$_id",
          bookingId: "$booking._id",

          bookingReference: "$booking.bookingReference",

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
            $literal: "hotel",
          },

          serviceName: {
            $ifNull: ["$hotel.name", "N/A"],
          },

          vendorName: {
            $ifNull: ["$vendor.businessName", "N/A"],
          },

          amountPaid: "$amountPaid",

          paymentMethod: 1,
          paymentStatus: "$status",

          refundStatus: "$refundStatus",

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

    const result = await Payment.aggregate(pipeline);

    const payments = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      payments,
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

exports.getPaymentDetail = async (paymentId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(paymentId),
        },
      },

      // BOOKING
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },

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
          localField: "booking.hotelId",
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

      // FINAL RESPONSE
      {
        $project: {
          paymentInfo: {
            paymentId: "$_id",
            razorpayOrderId: "$razorpayOrderId",
            razorpayPaymentId: "$razorpayPaymentId",
            amountPaid: "$amountPaid",
            currency: "$currency",
            paymentMethod: "$paymentMethod",
            status: "$status",
            isVerified: "$isVerified",
            createdAt: "$createdAt",
          },

          bookingInfo: {
            bookingId: "$booking._id",
            bookingReference: "$booking.bookingReference",
            status: "$booking.status",
            checkIn: "$booking.checkIn",
            checkOut: "$booking.checkOut",
            guests: "$booking.guests",
            totalAmount: "$booking.totalAmount",
          },

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

          service: {
            type: "hotel",
            hotel: {
              _id: "$hotel._id",
              name: "$hotel.name",
              city: "$hotel.city",
              address: "$hotel.address",
              image: { $arrayElemAt: ["$hotel.images.url", 0] },
            },
          },

          vendor: {
            _id: "$vendor._id",
            businessName: "$vendor.businessName",
            businessEmail: "$vendor.businessEmail",
            businessPhone: "$vendor.businessPhone",
            city: "$vendor.city",
            status: "$vendor.status",
          },

          //REFUND
          refund: {
            refundStatus: "$booking.refundStatus",
            refundAmount: "$booking.refundAmount",
            refundPercentage: "$booking.refundPercentage",
            cancellationReason: "$booking.cancellationReason",
            refundRequestedAt: "$booking.refundRequestedAt",
            refundedAt: "$refundedAt",
          },
        },
      },
    ];

    const result = await Payment.aggregate(pipeline);

    if (!result.length) {
      throw new Error("Payment not found");
    }

    return result[0];
  } catch (error) {
    throw error;
  }
};

exports.getPaymentStats = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $facet: {
          //Total Revenue (only captured)
          totalRevenue: [
            {
              $match: { status: "captured" },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amountPaid" },
              },
            },
          ],

          todaysRevenue: [
            {
              $match: {
                status: "captured",
                createdAt: { $gte: todayStart, $lte: todayEnd },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amountPaid" },
              },
            },
          ],

          //Pending Payments
          pendingPayments: [
            {
              $match: { status: "created" },
            },
            {
              $count: "count",
            },
          ],

          failedPayments: [
            {
              $match: { status: "failed" },
            },
            {
              $count: "count",
            },
          ],

          refundAmount: [
            {
              $match: {
                refundStatus: { $in: ["processed", "partially_refunded"] },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$refundAmount" },
              },
            },
          ],
        },
      },
    ];

    const result = await Payment.aggregate(pipeline);

    const stats = result[0];

    return {
      totalRevenue: stats.totalRevenue[0]?.total || 0,
      todaysRevenue: stats.todaysRevenue[0]?.total || 0,
      pendingPayments: stats.pendingPayments[0]?.count || 0,
      failedPayments: stats.failedPayments[0]?.count || 0,
      refundAmount: stats.refundAmount[0]?.total || 0,
    };
  } catch (error) {
    throw error;
  }
};

exports.getPaymentAnalytics = async (query) => {
  try {
    const { range = "7d" } = query;

    // decide date range
    const now = new Date();
    let startDate = new Date();

    if (range === "7d") startDate.setDate(now.getDate() - 7);
    else if (range === "30d") startDate.setDate(now.getDate() - 30);
    else if (range === "12m") startDate.setMonth(now.getMonth() - 12);

    const pipeline = [
      {
        $match: {
          status: "captured",
          createdAt: { $gte: startDate, $lte: now },
        },
      },

      {
        $facet: {
          //Revenue Trend (Date-wise)
          revenueTrend: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
                total: { $sum: "$amountPaid" },
              },
            },
            { $sort: { _id: 1 } },
          ],

          paymentMethods: [
            {
              $group: {
                _id: "$paymentMethod",
                count: { $sum: 1 },
                total: { $sum: "$amountPaid" },
              },
            },
          ],

          statusDistribution: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ];

    const result = await Payment.aggregate(pipeline);
    const data = result[0];

    return {
      revenueTrend: data.revenueTrend.map((item) => ({
        date: item._id,
        revenue: item.total,
      })),

      paymentMethods: data.paymentMethods.map((item) => ({
        method: item._id,
        count: item.count,
        total: item.total,
      })),

      statusDistribution: data.statusDistribution.map((item) => ({
        status: item._id,
        count: item.count,
      })),
    };
  } catch (error) {
    throw error;
  }
};

exports.getRefundRequests = async (query) => {
  try {
    let { page = 1, limit = 10, search } = query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: {
          status: "cancellation_requested",
          refundStatus: "pending",
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

      // PAYMENT
      {
        $lookup: {
          from: "payments",
          let: { bookingId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$bookingId", "$$bookingId"] },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "payment",
        },
      },
      {
        $unwind: {
          path: "$payment",
          preserveNullAndEmptyArrays: true,
        },
      },

      // SEARCH
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { bookingReference: { $regex: search, $options: "i" } },
                  { "user.firstName": { $regex: search, $options: "i" } },
                  { "user.lastName": { $regex: search, $options: "i" } },
                  { "user.email": { $regex: search, $options: "i" } },
                  { "hotel.name": { $regex: search, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      // FINAL RESPONSE
      {
        $project: {
          _id: 0,
          bookingId: "$_id",
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

          userEmail: { $ifNull: ["$user.email", ""] },

          serviceName: { $ifNull: ["$hotel.name", "N/A"] },
          vendorName: { $ifNull: ["$vendor.businessName", "N/A"] },

          totalAmount: 1,
          refundAmount: 1,
          refundPercentage: 1,

          cancellationReason: 1,

          paymentId: "$payment._id",
          paymentMethod: "$payment.method",

          createdAt: 1,
        },
      },

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Booking.aggregate(pipeline);

    const refunds = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return {
      refunds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.handleRefund = async (paymentId, action) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!["approve", "reject"].includes(action)) {
      throw new Error("Invalid action");
    }

    const payment = await Payment.findById(paymentId).session(session);
    if (!payment) throw new Error("Payment not found");

    const booking = await Booking.findById(payment.bookingId).session(session);
    if (!booking) throw new Error("Booking not found");

    if (
      booking.status !== "cancellation_requested" ||
      booking.refundStatus !== "pending"
    ) {
      throw new Error("No pending refund request");
    }

    const now = new Date();

    const daysBeforeCheckIn = Math.ceil(
      (new Date(booking.checkIn) - now) / (1000 * 60 * 60 * 24),
    );

    const isWithin24Hours =
      now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1000;

    let refundPercentage = 0;

    if (isWithin24Hours) refundPercentage = 100;
    else if (daysBeforeCheckIn >= 30) refundPercentage = 100;
    else if (daysBeforeCheckIn >= 15) refundPercentage = 50;
    else refundPercentage = 0;

    const refundAmount = Math.round(
      (booking.totalAmount * refundPercentage) / 100,
    );

    if (action === "approve") {
      // Prevent double refund
      if (payment.refundStatus === "processed") {
        throw new Error("Refund already processed");
      }

      if (!payment.razorpayPaymentId || payment.status !== "captured") {
        throw new Error("Payment not eligible for refund");
      }

      let refund = null;

      //Razorpay refund
      if (refundAmount > 0) {
        refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
          amount: refundAmount * 100,
        });
      }

      //RELEASE INVENTORY
      for (let i = 0; i < booking.nights; i++) {
        const currentDate = new Date(booking.checkIn.getTime() + i * 86400000);

        currentDate.setHours(0, 0, 0, 0);

        await Availability.findOneAndUpdate(
          {
            roomTypeId: booking.roomTypeId,
            date: currentDate,
          },
          {
            $inc: {
              bookedRooms: -booking.roomsBooked,
            },
          },
          { session },
        );
      }

      // UPDATE BOOKING
      booking.status = "cancelled";
      booking.refundStatus = refundAmount > 0 ? "processed" : "approved";
      booking.paymentStatus = refundAmount > 0 ? "refunded" : "paid";

      booking.refundAmount = refundAmount;
      booking.refundPercentage = refundPercentage;

      booking.refundProcessedAt = now;
      booking.cancelledAt = now;

      await booking.save({ session });

      //UPDATE PAYMENT
      payment.refundAmount = refundAmount;
      payment.refundStatus = refundAmount > 0 ? "processed" : "none";

      if (refund) {
        payment.razorpayRefundId = refund.id;
      }

      if (refundAmount === booking.totalAmount) {
        payment.status = "refunded";
      } else if (refundAmount > 0) {
        payment.status = "partially_refunded";
      }

      payment.refundedAt = refundAmount > 0 ? now : null;

      await payment.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        message: "Refund approved successfully",
        refundAmount,
        refundPercentage,
      };
    }

    if (action === "reject") {
      booking.status = "confirmed";
      booking.refundStatus = "rejected";

      await booking.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        message: "Refund request rejected",
      };
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// exports.handleRefund = async (paymentId, action) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!["approve", "reject"].includes(action)) {
//       throw new Error("Invalid action");
//     }

//     const payment = await Payment.findById(paymentId).session(session);
//     if (!payment) throw new Error("Payment not found");

//     const booking = await Booking.findById(payment.bookingId).session(session);
//     if (!booking) throw new Error("Booking not found");

//     if (
//       booking.status !== "cancellation_requested" ||
//       booking.refundStatus !== "pending"
//     ) {
//       throw new Error("No pending refund request");
//     }

//     const now = new Date();

//     //REFUND RECALCULATION
//     const daysBeforeCheckIn = Math.ceil(
//       (new Date(booking.checkIn) - now) / (1000 * 60 * 60 * 24)
//     );

//     const isWithin24Hours =
//       now - new Date(booking.createdAt) <= 24 * 60 * 60 * 1000;

//     let refundPercentage = 0;

//     if (isWithin24Hours) refundPercentage = 100;
//     else if (daysBeforeCheckIn >= 30) refundPercentage = 100;
//     else if (daysBeforeCheckIn >= 15) refundPercentage = 50;
//     else refundPercentage = 0;

//     const refundAmount = Math.round(
//       (booking.totalAmount * refundPercentage) / 100
//     );

//     // APPROVE
//     if (action === "approve") {
//       // Prevent double refund
//       if (payment.refundStatus === "processed") {
//         throw new Error("Refund already processed");
//       }

//       if (!payment.razorpayPaymentId || payment.status !== "captured") {
//         throw new Error("Payment not eligible for refund");
//       }

//       let refund = null;

//       //Razorpay refund
//       if (refundAmount > 0) {
//         refund = await razorpay.payments.refund(
//           payment.razorpayPaymentId,
//           {
//             amount: refundAmount * 100, // paise
//           }
//         );
//       }

//       //RELEASE ROOMS
//       const currentDate = new Date(booking.checkIn);

//       while (currentDate < booking.checkOut) {
//         await Availability.findOneAndUpdate(
//           {
//             roomTypeId: booking.roomTypeId,
//             date: new Date(currentDate),
//           },
//           {
//             $inc: { availableRooms: booking.roomsBooked },
//           },
//           { session, upsert: true }
//         );

//         currentDate.setDate(currentDate.getDate() + 1);
//       }

//       //UPDATE BOOKING
//       booking.status = "cancelled";
//       booking.refundStatus = refundAmount > 0 ? "processed" : "approved";
//       booking.paymentStatus = refundAmount > 0 ? "refunded" : "paid";

//       booking.refundAmount = refundAmount;
//       booking.refundPercentage = refundPercentage;

//       booking.refundProcessedAt = now;
//       booking.cancelledAt = now;

//       await booking.save({ session });

//       payment.refundAmount = refundAmount;
//       payment.refundStatus = refundAmount > 0 ? "processed" : "none";

//       if (refund) {
//         payment.razorpayRefundId = refund.id;
//       }

//       // Payment status update
//       if (refundAmount === booking.totalAmount) {
//         payment.status = "refunded";
//       } else if (refundAmount > 0) {
//         payment.status = "partially_refunded";
//       }

//       payment.refundedAt = refundAmount > 0 ? now : null;

//       await payment.save({ session });

//       await session.commitTransaction();
//       session.endSession();

//       return {
//         message: "Refund approved successfully",
//         refundAmount,
//         refundPercentage,
//       };
//     }

//     //REJECT
//     if (action === "reject") {
//       booking.status = "confirmed";
//       booking.refundStatus = "rejected";

//       await booking.save({ session });

//       await session.commitTransaction();
//       session.endSession();

//       return {
//         message: "Refund request rejected",
//       };
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };
