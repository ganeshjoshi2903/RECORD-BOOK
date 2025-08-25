import User from "../models/User.js";

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) return res.status(400).json({ message: "New password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword; // pre-save hashes it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please login." });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
