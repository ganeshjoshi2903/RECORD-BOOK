// import User from "../models/User.js";

// export const forgotPassword = async (req, res) => {
//   try {
//     let { email, newPassword, confirmPassword } = req.body;

//     if (!email || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     email = String(email).trim().toLowerCase();

//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ message: "User not found with this email" });

//     user.password = newPassword; // ❌ no bcrypt here
//     await user.save(); // ✅ pre('save') will hash

//     console.log("Password updated for:", email);
//     return res.status(200).json({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// forgotPassword.js controller file mein ye changes karo

import User from "../models/User.js";
import bcrypt from "bcryptjs"; // ✅ bcrypt ko import karna mat bhoolna

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body; // ... baaki validation code ...

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    } // ✅ Yahan naye password ko hash karo

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // ✅ Hashed password ko save karo

    await user.save();
    console.log("Password updated for:", email);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
