// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const authRoutes = require("./modules/auth/auth.routes");
// const userRoutes = require("./modules/users/user.routes");
// const { errorHandler } = require("./shared/middlewares/errorHandler");
// const passport = require("passport");

// require("./shared/config/passport");

// const app = express();

// // Middlewares
// app.use(helmet());
// app.use(cors(
//   {
//     origin: "http://localhost:3000",
//     credentials: true,
//   }
// ));
// app.use(passport.initialize());

// app.use(express.json());

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// app.get("/health", (req, res) => res.status(200).send("API is running..."));

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);

// app.use(errorHandler);

// module.exports = app;

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
const vendorRoutes = require("./modules/vendors/vendor.routes");

const { errorHandler } = require("./shared/middlewares/errorHandler");
require("./shared/config/passport");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Rate limiting
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
app.use("/api/v1/vendors", vendorRoutes);

app.use(errorHandler);

module.exports = app;
