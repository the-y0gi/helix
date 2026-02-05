const User = require("./auth.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const logger = require("../../shared/utils/logger");
const { sendOTPEmail } = require("../../shared/utils/sendEmail");

//Generate and Send OTP
exports.requestOTP = async (email) => {
  try {
    const otp = crypto.randomInt(1000, 10000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    await User.findOneAndUpdate(
      { email },
      {
        otp: hashedOTP,
        otpExpires,
        $setOnInsert: {
          role: "user",
          "providers.local.isVerified": false,
        },
      },
      { upsert: true, new: true },
    );

    console.log(`[DEV] Helix OTP for ${email}: ${otp}`);

    //in future we can use queue system to send emails
    await sendOTPEmail(email, otp);

    return {
      success: true,
      message: "OTP sent to your email",
    };
  } catch (error) {
    console.error("requestOTP failed:", error.message);
    throw error;
  }
};

//Verify OTP and Login
exports.verifyOTP = async (email, inputOTP) => {
  try {
    const user = await User.findOne({ email }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    // Check if OTP is expired
    if (Date.now() > user.otpExpires) {
      throw new Error("OTP expired");
    }

    const isMatch = await bcrypt.compare(inputOTP, user.otp);
    if (!isMatch) {
      throw new Error("Invalid OTP");
    }

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.info(`User verified: ${email}`);

    return { user, message: "Login successful" };
  } catch (error) {
    logger.error("Error in verifyOTP Service", error);
    throw error;
  }
};
