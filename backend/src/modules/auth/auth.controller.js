const authService = require("./auth.service");
const logger = require("../../shared/utils/logger");
const { generateTokens } = require("../../shared/utils/jwt");

// Helper function to set refresh token cookie
const setTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Helper to filter user data (Strictly avoid sending password/otp)
const filterUserData = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.providers?.local?.isVerified || false,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

// Unified Error Handler for Controllers
const handleError = (res, error, status = 400) => {
  logger.error(`Auth Error: ${error.message}`);
  return res.status(status).json({ success: false, message: error.message });
};

exports.socialAuthSuccess = async (req, res) => {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    setTokenCookie(res, refreshToken);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth-callback?token=${accessToken}`,
    );
  } catch (error) {
    logger.error("Social Auth Success Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password,role } = req.body;
    const result = await authService.signup(email, password,role);
    res.status(201).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, message } = await authService.login(email, password);
    const { accessToken, refreshToken } = generateTokens(user._id);

    setTokenCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: { user: filterUserData(user) },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const result = await authService.resendOTP(req.body.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { user, message } = await authService.verifyOTP(email, otp);
    const { accessToken, refreshToken } = generateTokens(user._id);

    setTokenCookie(res, refreshToken);
    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: { user: filterUserData(user) },
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email, otp, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user.id,
      oldPassword,
      newPassword,
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
