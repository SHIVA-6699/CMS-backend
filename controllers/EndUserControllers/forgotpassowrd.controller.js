import nodemailer from "nodemailer";
import EndUser from "../../models/EndUserModels/enduser.model.js";
import bcrypt from "bcryptjs";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service:"gmail",
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// router.post("/forgot-password/send-otp", async (req, res) => {
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await EndUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const emailHtml = `
      <html>
        <body>
          <h1>OTP for Password Reset</h1>
          <p>Dear ${user.name},</p>
          <p>Your OTP for password reset is:</p>
          <h2>${otp}</h2>
          <p>This OTP will expire in 15 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: emailHtml,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP." });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await EndUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP." });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if both email and newPassword are provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    const user = await EndUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update the user record
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null; // Clear OTP
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};
