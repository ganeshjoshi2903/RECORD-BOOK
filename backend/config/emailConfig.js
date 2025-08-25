import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // ✅ make sure env loads before transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify transporter
transporter.verify((error, success) => {
  if (error) console.error("Email transporter error:", error);
  else console.log("✅ Email transporter ready");
});

export default transporter;
