const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const passport = require("passport");

//Route: /api/v1/auth/request-otp
router.post("/request-otp", authController.requestOTP);

//Route: /api/v1/auth/verify-otp
router.post("/verify-otp", authController.verifyOTP);

//--social auth 
//Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.socialAuthSuccess,
);

//Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], session: false }),
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  authController.socialAuthSuccess,
);

//Apple
router.get("/apple", passport.authenticate("apple", { session: false }));
router.post(
  "/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login", session: false }),
  authController.socialAuthSuccess,
);

module.exports = router;
