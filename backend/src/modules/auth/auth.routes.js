const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const passport = require("passport");
const { protect } = require("../../shared/middlewares/verifyToken");
const rateLimit = require("express-rate-limit");

// Standard limiter for general auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    success: false,
    message: "Too many attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for OTP and Login 
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 OTP requests per hour
  message: {
    success: false,
    message: "OTP limit exceeded, please try again after an hour",
  },
});

// Applied Routes
router.post("/resend-otp", otpLimiter, authController.resendOTP);
router.post("/verify-otp", authLimiter, authController.verifyOTP);
router.post("/signup", authLimiter, authController.signup);
router.post("/login", authLimiter, authController.login);

// Password Management
router.post("/forgot-password", otpLimiter, authController.forgotPassword);
router.patch("/reset-password", authLimiter, authController.resetPassword);
router.patch("/change-password", protect, authController.changePassword);

//--social auth
// Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess
);

// Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess
);

// Apple
router.get(
  "/apple",
  passport.authenticate("apple", { session: false })
);

router.post(
  "/apple/callback",
  passport.authenticate("apple", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  authController.socialAuthSuccess
);

module.exports = router;
