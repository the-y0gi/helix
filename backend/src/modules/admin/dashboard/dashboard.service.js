const User = require("../../auth/auth.model");
const Hotel = require("../../hotels/hotel.model");
const Booking = require("../../bookings/booking.model");

exports.getDashboard = async ({ bookingRange = 7, revenueRange = 6 }) => {
  try {
    const [totalUsers, totalProperties, totalBookings] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Hotel.countDocuments(),
      Booking.countDocuments(),
    ]);

    //Today bookings
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart },
    });

    //Total Revenue
    const revenueAgg = await Booking.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    //daily booking charts
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (bookingRange - 1));
    startDate.setHours(0, 0, 0, 0);

    const dailyBookingsRaw = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyBookings = [];

    for (let i = 0; i < bookingRange; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const formatted = date.toISOString().split("T")[0];

      const found = dailyBookingsRaw.find((d) => d._id === formatted);

      dailyBookings.push({
        date: formatted,
        count: found ? found.count : 0,
      });
    }

    //months charts

    const startMonth = new Date();
    startMonth.setMonth(startMonth.getMonth() - (revenueRange - 1));
    startMonth.setDate(1);
    startMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueRaw = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startMonth },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyRevenue = [];

    for (let i = 0; i < revenueRange; i++) {
      const date = new Date(startMonth);
      date.setMonth(date.getMonth() + i);

      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const found = monthlyRevenueRaw.find(
        (m) => m._id.month === month && m._id.year === year,
      );

      monthlyRevenue.push({
        month: `${year}-${month.toString().padStart(2, "0")}`,
        revenue: found ? found.revenue : 0,
      });
    }

    return {
      stats: {
        totalUsers,
        totalProperties,
        totalBookings,
        todayBookings,
        totalRevenue,
      },
      charts: {
        dailyBookings,
        monthlyRevenue,
      },
    };
  } catch (error) {
    throw error;
  }
};

exports.getRecentBookings = async () => {
  try {
    const bookings = await Booking.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

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

          propertyName: "$hotel.name",

          serviceType: {
            $ifNull: ["$vendor.serviceType", "hotel"],
          },

          checkIn: 1,
          checkOut: 1,
          totalAmount: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    return bookings;
  } catch (error) {
    throw error;
  }
};
