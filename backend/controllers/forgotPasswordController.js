import crypto from "crypto";
import User from "../models/User.js";
import transporter from "../config/emailConfig.js";

export const sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token + expiry in DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("🔗 Reset URL:", resetURL);

    // Send mail
    await transporter.sendMail({
      from: `"RecordBook App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello <b>${user.name}</b>,</p>
        <p>Click the link below to reset your password (expires in 15 minutes):</p>
        <a href="${resetURL}" target="_blank">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    console.log("✅ Reset email sent:", { to: user.email });
    res.json({ message: `Reset link sent to: ${user.email}` });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
