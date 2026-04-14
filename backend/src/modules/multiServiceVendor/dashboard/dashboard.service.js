const Booking = require("../../multiServiceBookings/booking.model");

exports.getDashboardStats = async (query = {}, vendorId) => {
  try {
    const { serviceType } = query;

    // 🔥 Base filter
    const filter = {
      status: { $ne: "cancelled" },
    };

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    // 🔥 IMPORTANT: vendor filter (via serviceSnapshot ya serviceId mapping)
    // 👉 assuming service me vendorId saved hai
    filter["serviceSnapshot.vendorId"] = vendorId;

    // 🟢 1. Total Bookings
    const totalBookingsPromise = Booking.countDocuments(filter);

    // 🟢 2. New Bookings (Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newBookingsPromise = Booking.countDocuments({
      ...filter,
      createdAt: { $gte: todayStart },
    });

    // 🔴 3. Cancelled Bookings
    const cancelledBookingsPromise = Booking.countDocuments({
      ...filter,
      status: "cancelled",
    });

    // 💰 4. Total Revenue (only paid)
    const revenuePromise = Booking.aggregate([
      {
        $match: {
          ...filter,
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.totalAmount" },
        },
      },
    ]);

    const [totalBookings, newBookings, cancelledBookings, revenueResult] =
      await Promise.all([
        totalBookingsPromise,
        newBookingsPromise,
        cancelledBookingsPromise,
        revenuePromise,
      ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return {
      totalRevenue,
      totalBookings,
      newBookings,
      cancelledBookings,
    };
  } catch (error) {
    throw error;
  }
};

exports.getDashboardAnalytics = async (query = {}, vendorId) => {
  try {
    const { serviceType, revenueRange = "6m", bookingRange = "7d" } = query;

    const now = new Date();

    // 🔥 Base Filter
    const baseFilter = {
      vendorId,
    };

    if (serviceType) {
      baseFilter.serviceType = serviceType;
    }

    // =========================
    // 🟢 REVENUE GRAPH (MONTHLY)
    // =========================

    let months = 6;
    if (revenueRange === "3m") months = 3;
    if (revenueRange === "12m") months = 12;

    const revenueStartDate = new Date();
    revenueStartDate.setMonth(now.getMonth() - months);

    const revenueData = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          paymentStatus: "paid",
          createdAt: { $gte: revenueStartDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$pricing.totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format revenue
    const formattedRevenue = revenueData.map((item) => ({
      month: `${item._id.month}-${item._id.year}`,
      revenue: item.totalRevenue,
    }));

    // =========================
    // 🔵 BOOKINGS GRAPH (DAILY)
    // =========================

    let days = 7;
    if (bookingRange === "15d") days = 15;
    if (bookingRange === "30d") days = 30;

    const bookingStartDate = new Date();
    bookingStartDate.setDate(now.getDate() - days);

    const bookingData = await Booking.aggregate([
      {
        $match: {
          ...baseFilter,
          createdAt: { $gte: bookingStartDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    // Format bookings
    const formattedBookings = bookingData.map((item) => ({
      date: `${item._id.day}-${item._id.month}`,
      bookings: item.totalBookings,
    }));

    return {
      revenue: formattedRevenue,
      bookings: formattedBookings,
    };
  } catch (error) {
    throw error;
  }
};

exports.getRecentBookings = async (query = {}, vendorId) => {
  try {
    const { serviceType, status, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    // 🔥 Base Filter
    const filter = {
      vendorId,
    };

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (status) {
      filter.status = status;
    }

    // 🔥 Query
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit))
      .select(
        "bookingReference serviceType bookingDate pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot",
      )
      .lean();

    // 🔥 Total Count (for pagination)
    const total = await Booking.countDocuments(filter);

    // 🔥 Format Response (UI friendly)
    const formattedBookings = bookings.map((b) => ({
      id: b._id,
      bookingReference: b.bookingReference,

      customerName: `${b.primaryCustomer.firstName} ${
        b.primaryCustomer.lastName || ""
      }`,

      serviceTitle: b.serviceSnapshot?.title || "N/A",
      serviceType: b.serviceType,

      bookingDate: b.bookingDate,

      amount: b.pricing?.totalAmount || 0,

      status: b.status,
      paymentStatus: b.paymentStatus,
    }));

    return {
      count: formattedBookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: formattedBookings,
    };
  } catch (error) {
    throw error;
  }
};
