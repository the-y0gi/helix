const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../../shared/config/razorpay");
const Booking = require("./booking.model");
const Payment = require("./payment.model");
const Tax = require("../admin/tax/tax.model");

const logger = require("../../shared/utils/logger");

const Service = require("../adventure/service/service.model");
// later: cabService, tourService will be add

exports.createBooking = async (data, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      serviceType,
      serviceId,
      bookingDate,
      timeSlot,
      primaryCustomer,
      participants = [],
      meta = {},
    } = data;

    if (!serviceType || !serviceId || !bookingDate) {
      throw new Error("Service, serviceId and bookingDate are required");
    }

    let service;

    if (serviceType === "adventure") {
      service = await Service.findById(serviceId).lean();
    }

    // future
    // if (serviceType === "cab") {
    //   service = await CabService.findById(serviceId).lean();
    // }

    // if (serviceType === "tour") {
    //   service = await TourService.findById(serviceId).lean();
    // }

    if (!service || !service.isActive) {
      throw new Error("Service not available");
    }

    //TAX
    const taxDoc = await Tax.findOne({ isActive: true }).lean();
    const taxPercentage = taxDoc?.taxPercentage || 0;

    //PRICE
    const effectivePrice =
      service.discountPrice > 0 ? service.discountPrice : service.basePrice;

    const quantity = participants.length > 0 ? participants.length : 1;

    const baseAmount = effectivePrice * quantity;

    const taxAmount = Number(((baseAmount * taxPercentage) / 100).toFixed(2));

    const totalAmount = Math.round(Number(baseAmount + taxAmount));

    let extraInfo = {};

    if (serviceType === "adventure") {
      if (service.type === "time") {
        extraInfo = {
          label: "Duration",
          value: service.meta?.duration || "N/A",
        };
      } else if (service.type === "distance") {
        extraInfo = {
          label: "Distance",
          value: service.meta?.distance || "N/A",
        };
      } else if (service.type === "package") {
        extraInfo = {
          label: "Package",
          value: `${service.meta?.days || 0}D / ${service.meta?.nights || 0}N`,
        };
      }
    }

    // future: cab, tour
    // if (serviceType === "cab") {
    //   extraInfo = {
    //     label: "Route",
    //     value: `${meta.pickup} → ${meta.drop}`,
    //   };
    // }

    // if (serviceType === "tour") {
    //   extraInfo = {
    //     label: "Package",
    //     value: `${service.meta?.days} Days / ${service.meta?.nights} Nights`,
    //   };
    // }

    //BOOKING REF
    const bookingReference =
      "BK-" + crypto.randomBytes(6).toString("hex").toUpperCase();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    //CREATE BOOKING
    const [booking] = await Booking.create(
      [
        {
          userId,
          vendorId: service?.vendorId || null,

          serviceType,
          serviceId,
          bookingReference,

          bookingDate,
          timeSlot,

          primaryCustomer,
          participants,
          meta,
          extraInfo,

          quantity,

          pricing: {
            baseAmount,
            taxAmount,
            taxPercentage,
            totalAmount,
          },

          serviceSnapshot: {
            title: service.title,
            type: service.type,
            price: effectivePrice,
          },

          status: "pending",
          paymentStatus: "pending",
          expiresAt,
        },
      ],
      { session },
    );

    //RAZORPAY
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: bookingReference,
    });

    //PAYMENT
    const [payment] = await Payment.create(
      [
        {
          bookingId: booking._id,
          userId,
          gatewayOrderId: razorpayOrder.id,
          amount: totalAmount,
          status: "created",
          metadata: {
            serviceType,
            bookingReference,
          },
          expiresAt,
        },
      ],
      { session },
    );

    booking.paymentId = payment._id;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      booking,
      razorpayOrder,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// exports.verifyPayment = async (data) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       throw new Error("Missing payment verification data");
//     }

//     //Find Payment
//     const payment = await Payment.findOne({
//       gatewayOrderId: razorpay_order_id,
//     }).session(session);

//     if (!payment) {
//       throw new Error("Payment record not found");
//     }

//     //Idempotency Check
//     if (payment.isVerified && payment.status === "captured") {
//       const existingBooking = await Booking.findById(payment.bookingId)
//         .lean()
//         .session(session);

//       await session.commitTransaction();
//       session.endSession();

//       return existingBooking;
//     }

//     if (payment.status !== "created") {
//       throw new Error("Invalid payment state");
//     }

//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       throw new Error("Invalid payment signature");
//     }

//     payment.gatewayPaymentId = razorpay_payment_id;
//     payment.gatewaySignature = razorpay_signature;
//     payment.status = "captured";
//     payment.isVerified = true;
//     payment.expiresAt = undefined;

//     await payment.save({ session });

//     const booking = await Booking.findById(payment.bookingId).session(session);

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     if (booking.status !== "pending") {
//       throw new Error("Invalid booking state");
//     }

//     if (payment.amount !== booking.pricing.totalAmount) {
//       throw new Error("Payment amount mismatch");
//     }

//     booking.status = "confirmed";
//     booking.paymentStatus = "paid";
//     booking.expiresAt = undefined;

//     await booking.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     // (Optional) Send Email
//     // await sendBookingConfirmationEmail(...)

//     return booking;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     logger.error("Service Error: verifyPayment", error);
//     throw error;
//   }
// };

exports.verifyPayment = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }

    const payment = await Payment.findOne({
      gatewayOrderId: razorpay_order_id,
    }).session(session);

    if (!payment) {
      throw new Error("Payment record not found");
    }

    // Idempotency
    if (payment.isVerified && payment.status === "captured") {
      const existingBooking = await Booking.findById(payment.bookingId)
        .lean()
        .session(session);

      await session.commitTransaction();
      session.endSession();

      return existingBooking;
    }

    if (payment.status !== "created") {
      throw new Error("Invalid payment state");
    }

    //pAYMENT EXPIRY CHECK
    if (payment.expiresAt && payment.expiresAt < new Date()) {
      throw new Error("Payment session expired");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    payment.status = "captured";
    payment.isVerified = true;
    payment.paymentMethod = razorpayPayment.method || "unknown";
    payment.expiresAt = undefined;

    await payment.save({ session });

    const booking = await Booking.findById(payment.bookingId).session(session);

    if (!booking) {
      throw new Error("Booking not found");
    }

    //BOOKING EXPIRY CHECK
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      throw new Error("Booking expired. Please create a new booking.");
    }

    if (booking.status !== "pending") {
      throw new Error("Invalid booking state");
    }

    if (payment.amount !== booking.pricing.totalAmount) {
      throw new Error("Payment amount mismatch");
    }

    // ATOMIC UPDATE
    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        status: "pending",
        expiresAt: { $gt: new Date() },
      },
      {
        status: "confirmed",
        paymentStatus: "paid",
        expiresAt: undefined,
      },
      { new: true, session },
    );

    if (!updatedBooking) {
      throw new Error("Booking expired or already processed");
    }

    await session.commitTransaction();
    session.endSession();

    return updatedBooking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Service Error: verifyPayment", error);
    throw error;
  }
};
