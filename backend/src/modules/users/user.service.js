const User = require("../auth/auth.model");
const logger = require("../../shared/utils/logger");

exports.getUserProfile = async (userId) => {
  return await User.findById(userId).select("-otp -otpExpires");
};

exports.updateUserProfile = async (userId, updateData) => {
  // Block email updates for security
  if (updateData.email) {
    throw new Error("Email address cannot be updated");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-otp -otpExpires");

  return updatedUser;
};
