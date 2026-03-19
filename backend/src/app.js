const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const passport = require("passport");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const hotelRoutes = require("./modules/hotels/hotel.routes");
const roomRoutes = require("./modules/rooms/room.routes");
const roomTypeRoutes = require("./modules/rooms/roomType.routes");
const availabilityRoutes = require("./modules/availability/availability.routes");
const vendorRoutes = require("./modules/vendors/vendor.routes");
const policyRoutes = require("./modules/policies/policy.routes");
const bookingRoutes = require("./modules/bookings/booking.routes");
const paymentRoutes = require("./modules/payments/payment.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const favoriteRoutes = require("./modules/favorites/favorite.routes");
const vendorBank = require("./modules/vendorBank/bank.routes");

const adminRoutes = require("./modules/admin/property/property.routes");
const adminUserRoutes = require("./modules/admin/user/user.routes");

const { errorHandler } = require("./shared/middlewares/errorHandler");
require("./shared/config/passport");

const app = express();

app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
  process.env.VENDOR_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate limiting..
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(passport.initialize());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => res.status(200).send("API is running..."));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/room-types", roomTypeRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/policies", policyRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/vendor-bank", vendorBank);

app.use("/api/v1/admin/property", adminRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);

app.use(errorHandler);

module.exports = app;
