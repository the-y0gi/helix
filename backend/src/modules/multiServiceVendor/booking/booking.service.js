const mongoose = require("mongoose");
const Booking = require("../../multiServiceBookings/booking.model");

exports.getUserBookings = async (query = {}, vendorId) => {
  try {
    const { serviceType, status, search, page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const filter = {
      vendorId,
    };

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    if (status) {
      filter.status = status;
    }

    //SEARCH (customer name + bookingReference)
    if (search) {
      filter.$or = [
        {
          bookingReference: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "primaryCustomer.firstName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "primaryCustomer.lastName": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit))
      .select(
        "bookingReference serviceType bookingDate extraInfo pricing.totalAmount status paymentStatus primaryCustomer serviceSnapshot",
      )
      .lean();

    const total = await Booking.countDocuments(filter);

    const formattedBookings = bookings.map((b) => ({
      id: b._id,

      bookingReference: b.bookingReference,

      customerName: `${b.primaryCustomer.firstName} ${
        b.primaryCustomer.lastName || ""
      }`,

      serviceTitle: b.serviceSnapshot?.title || "N/A",

      serviceType: b.serviceType,

      bookingDate: b.bookingDate,

      extraInfo: b.extraInfo || {},

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

exports.getUserBookingById = async (bookingId, vendorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking id");
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      vendorId,
    })
      .select(
        "bookingReference serviceType serviceSnapshot bookingDate timeSlot primaryCustomer participants meta extraInfo pricing status paymentStatus createdAt",
      )
      .lean();

    if (!booking) {
      throw new Error("Booking not found");
    }

    const formattedBooking = {
      id: booking._id,

      bookingReference: booking.bookingReference,

      service: {
        title: booking.serviceSnapshot?.title || "N/A",
        type: booking.serviceType,
        subType: booking.serviceSnapshot?.type || null,
      },

      customer: {
        name: `${booking.primaryCustomer.firstName} ${
          booking.primaryCustomer.lastName || ""
        }`,
        email: booking.primaryCustomer.email,
        phone: booking.primaryCustomer.phoneNumber,
      },

      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot || null,

      extraInfo: booking.extraInfo || {},

      participants: booking.participants || [],

      meta: booking.meta || {},

      pricing: {
        baseAmount: booking.pricing?.baseAmount || 0,
        taxAmount: booking.pricing?.taxAmount || 0,
        taxPercentage: booking.pricing?.taxPercentage || 0,
        totalAmount: booking.pricing?.totalAmount || 0,
      },

      status: booking.status,
      paymentStatus: booking.paymentStatus,

      createdAt: booking.createdAt,
    };

    return formattedBooking;
  } catch (error) {
    throw error;
  }
};
