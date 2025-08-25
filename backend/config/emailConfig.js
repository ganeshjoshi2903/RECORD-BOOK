import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,        // SSL
  secure: true,     // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // must be Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,   // bypass some TLS issues
  },
});

transporter.verify((error, success) => {
  if (error) console.error("Email transporter error:", error);
  else console.log("✅ Email transporter ready");
});

export default transporter;
