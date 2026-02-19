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

const sendBookingConfirmationEmail = async (email, details) => {
  try {
    const mailOptions = {
      from: `"Helix Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Booking Confirmed! Reference: ${details.bookingId}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
          <h2 style="color: #f97316;">Booking Confirmed! 🥳</h2>
          <p>Hi <strong>${details.customerName}</strong>,</p>
          <p>Pack your bags! Your stay at <strong>${details.hotelName}</strong> has been successfully booked.</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${details.bookingId}</p>
            <p style="margin: 5px 0;"><strong>Room Type:</strong> ${details.roomName}</p>
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(details.checkIn).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(details.checkOut).toLocaleDateString()}</p>
            <p style="margin: 5px 0; color: #16a34a;"><strong>Total Paid:</strong> ₹${details.amount}</p>
          </div>

          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Happy Travels,<br/><strong>Team Helix</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    logger.error("Helix booking email send failed:", err.message);
    throw err;
  }
};

module.exports = { sendOTPEmail, sendBookingConfirmationEmail };
