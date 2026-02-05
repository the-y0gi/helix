const User = require("./auth.model");
const crypto = require("crypto");
const logger = require("../../shared/utils/logger");
const { sendOTPEmail } = require("../../shared/utils/sendEmail");

// Helper to generate 6-digit OTP and its hash
const generateOTP = async () => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { otp, otpExpires };
};


exports.signup = async (email, password) => {
  try {
    let user = await User.findOne({ email });

    if (user && user.providers.local.isVerified) {
      throw new Error("Email already registered. Please login.");
    }

    const { otp, otpExpires } = await generateOTP();

    if (!user) {
      user = new User({
        email,
        password,
        role: "user",
        otp,
        otpExpires,
        providers: {
          local: { isVerified: false },
        },
      });
    } else {
      user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.providers.local.isVerified = false;
    }

    await user.save();
    await sendOTPEmail(email, otp);

    return { message: "OTP sent to your email for verification" };
  } catch (error) {
    logger.error("Service Error: signup", error);
    throw error;
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    if (!user.password) throw new Error("Please use social login");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }

    return { user, message: "Login successful" };
  } catch (error) {
    throw error;
  }
};

exports.resendOTP = async (email) => {
  try {
    const { otp, otpExpires } = await generateOTP();
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true },
    );

    if (!user) throw new Error("User not found");

    await sendOTPEmail(email, otp);
    return { message: "OTP sent successfully" };
  } catch (error) {
    throw error;
  }
};

exports.verifyOTP = async (email, inputOTP) => {
  try {
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user) throw new Error("User not found");

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      throw new Error("OTP expired");
    }
    if (String(inputOTP) !== String(user.otp)) throw new Error("Invalid OTP");

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { user, message: "Verification successful" };
  } catch (error) {
    throw error;
  }
};


exports.forgotPassword = async (email) => {
  try {
    const { otp, otpExpires } = await generateOTP();
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { new: true },
    );

    if (!user) throw new Error("User not found");

    await sendOTPEmail(email, otp);
    return { message: "Password reset OTP sent to email" };
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (email, otp, newPassword) => {
  try {
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      throw new Error("Invalid or expired OTP");
    }

    user.password = newPassword; 
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: "Password reset successful" };
  } catch (error) {
    throw error;
  }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new Error("Old password is incorrect");

    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};
