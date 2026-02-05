const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const { errorHandler } = require("./shared/middlewares/errorHandler");
const passport = require("passport");


require("./shared/config/passport"); 


const app = express();

// Middlewares
app.use(helmet());
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
  }
)); 
app.use(passport.initialize());

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => res.status(200).send("API is running..."));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);


app.use(errorHandler);

module.exports = app;
