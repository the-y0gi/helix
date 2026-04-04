const User = require("./auth.model");
const Vendor = require("../vendors/vendor.model");
const crypto = require("crypto");
const logger = require("../../shared/utils/logger");
const {
  sendOTPEmail,
  sendWhatsAppOTP,
} = require("../../shared/utils/sendEmail");

// Helper to generate 6-digit OTP and its hash
const generateOTP = async () => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { otp, otpExpires };
};

//helper function to phone number
const normalizePhone = (phone) => {
  if (!phone) throw new Error("Phone number is required");

  //remove spaces, dashes, etc
  phone = phone.replace(/\D/g, "");

  // case 1: 10 digit (9876543210)
  if (phone.length === 10) {
    return `+91${phone}`;
  }

  // case 2: 12 digit (919876543210)
  if (phone.length === 12 && phone.startsWith("91")) {
    return `+${phone}`;
  }

  // case 3: already with country but without +
  if (phone.length > 10 && !phone.startsWith("91")) {
    throw new Error("Invalid phone number format");
  }

  // case 4: fallback invalid
  throw new Error("Invalid phone number");
};

exports.whatsappSignup = async (phone, password) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    let user = await User.findOne({ phoneNumber });

    if (user && user.providers.local.isVerified) {
      throw new Error("User already exists. Please login.");
    }

    const { otp, otpExpires } = await generateOTP();

    if (!user) {
      user = new User({
        phoneNumber,
        password,
        role: "user",
        otp,
        otpExpires,
        providers: {
          local: { isVerified: false },
        },
      });
    } else {
      if (password) user.password = password;

      user.otp = otp;
      user.otpExpires = otpExpires;
      user.providers.local.isVerified = false;
    }

    await user.save();

    //send WhatsApp OTP
    await sendWhatsAppOTP(phoneNumber, otp);

    return {
      message: "OTP sent on WhatsApp",
    };
  } catch (error) {
    throw error;
  }
};

exports.whatsappVerify = async (phone, inputOTP) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      throw new Error("OTP expired");
    }

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return {
      user,
      message: "Verification successful",
    };
  } catch (error) {
    throw error;
  }
};

exports.whatsappLogin = async (phone, password) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+password");

    if (!user) throw new Error("Invalid credentials");

    if (!user.password) {
      throw new Error("Please login using OTP");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    if (!user.providers.local.isVerified) {
      throw new Error("Account not verified. Please verify your OTP.");
    }

    return {
      user,
      message: "Login successful",
    };
  } catch (error) {
    throw error;
  }
};

exports.signup = async (email, password, role) => {
  try {
    const allowedRoles = ["user", "vendor", "admin"];

    if (role && !allowedRoles.includes(role)) {
      throw new Error("Invalid role");
    }

    let user = await User.findOne({ email });

    if (user && user.providers.local.isVerified) {
      throw new Error("Email already registered. Please login.");
    }

    const { otp, otpExpires } = await generateOTP();

    if (!user) {
      user = new User({
        email,
        password,
        role: role || "user",
        otp,
        otpExpires,
        isVendor: role === "vendor",
        providers: {
          local: { isVerified: false },
        },
      });
    } else {
      // don't blindly overwrite password unless needed
      if (password) user.password = password;

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

// exports.login = async (email, password) => {
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) throw new Error("Invalid credentials");

//   if (!user.password) throw new Error("Please use social login");

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   if (!user.providers.local.isVerified) {
//     throw new Error("Account not verified. Please verify your OTP.");
//   }

//   //Vendor approval check
//   if (user.role === "vendor") {
//     const vendor = await Vendor.findOne({ userId: user._id });

//     if (!vendor) {
//       throw new Error("Vendor profile not found");
//     }

//     if (vendor.status === "pending") {
//       throw new Error("Waiting for super admin approval");
//     }

//     if (vendor.status === "rejected") {
//       const reason = vendor.adminRemark || "Application rejected";
//       throw new Error(reason);
//     }
//   }

//   return { user, message: "Login successful" };
// };

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

    if (String(inputOTP) !== String(user.otp)) {
      throw new Error("Invalid OTP");
    }

    // verify user
    user.providers.local.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    let vendor = null;

    //CREATE VENDOR IF ROLE = VENDOR
    if (user.role === "vendor") {
      vendor = await Vendor.findOne({ userId: user._id });

      if (!vendor) {
        vendor = await Vendor.create({
          userId: user._id,
          serviceType: null, // step 2 set
          status: "draft",
          currentStep: 1,
          registrationStep: 1,
        });
      }
    }

    return {
      user,
      vendor,
      message: "Verification successful",
    };
  } catch (error) {
    throw error;
  }
};

exports.forgotPassword = async (phone) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const { otp, otpExpires } = await generateOTP();

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpires },
      { new: true },
    );

    if (!user) throw new Error("User not found");

    await sendWhatsAppOTP(phoneNumber, otp);

    return { message: "Password reset OTP sent on WhatsApp" };
  } catch (error) {
    throw error;
  }
};

exports.otpVerify = async (phone, inputOTP) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    if (
      !user.otp ||
      String(user.otp) !== String(inputOTP) ||
      Date.now() > user.otpExpires
    ) {
      throw new Error("Invalid or expired OTP");
    }

    return { message: "OTP verified successfully" };
  } catch (error) {
    throw error;
  }
};

exports.resetPassword = async (phone, otp, newPassword) => {
  try {
    if (!phone) throw new Error("Phone number is required");

    const phoneNumber = normalizePhone(phone);

    const user = await User.findOne({ phoneNumber }).select("+otp +otpExpires");

    if (!user) throw new Error("User not found");

    if (
      !user.otp ||
      String(user.otp) !== String(otp) ||
      Date.now() > user.otpExpires
    ) {
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

// exports.forgotPassword = async (email) => {
//   try {
//     const { otp, otpExpires } = await generateOTP();
//     const user = await User.findOneAndUpdate(
//       { email },
//       { otp, otpExpires },
//       { new: true },
//     );

//     if (!user) throw new Error("User not found");

//     await sendOTPEmail(email, otp);
//     return { message: "Password reset OTP sent to email" };
//   } catch (error) {
//     throw error;
//   }
// };

// exports.otpVerify = async (email, otp) => {
//   try {
//     const user = await User.findOne({ email }).select("+otp +otpExpires");

//     if (
//       !user ||
//       user.otp.toString() !== otp.toString() ||
//       Date.now() > user.otpExpires
//     ) {
//       throw new Error("Invalid or expired OTP");
//     }

//     return { message: "OTP verified successfully" };
//   } catch (error) {
//     throw error;
//   }
// };

// exports.resetPassword = async (email, otp, newPassword) => {
//   try {
//     const user = await User.findOne({ email }).select("+otp +otpExpires");
//     if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
//       throw new Error("Invalid or expired OTP");
//     }

//     user.password = newPassword;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     return { message: "Password reset successful" };
//   } catch (error) {
//     throw error;
//   }
// };

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
