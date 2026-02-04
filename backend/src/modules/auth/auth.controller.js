const authService = require("./auth.service");
const logger = require("../../shared/utils/logger");
const { generateTokens } = require("../../shared/utils/jwt");


//social auth success
exports.socialAuthSuccess = async (req, res) => {
  try {
    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 din
    });

    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${accessToken}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

//request otp
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.requestOTP(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error("Controller Error: requestOTP", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

//verify otp  
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { user, message } = await authService.verifyOTP(email, otp);

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      success: true,
      message,
      accessToken,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
