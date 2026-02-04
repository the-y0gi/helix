const jwt = require("jsonwebtoken");
const User = require("../../modules/auth/auth.model");
const logger = require("../utils/logger");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = await User.findById(decoded.id).select("-otp");
    next();
  } catch (error) {
    logger.error("Auth Middleware Error", error);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};
