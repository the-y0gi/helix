require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email for Helix – OTP Inside",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Welcome to Helix 🚀</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 3px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore.</p>
          <br/>
          <p>— Team Helix</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Helix email send failed:", err.message);
    throw err;
  }
};

module.exports = { sendOTPEmail };
