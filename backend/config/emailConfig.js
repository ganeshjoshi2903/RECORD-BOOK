import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP host
  port: 587, // TLS port
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER, // your Brevo login email
    pass: process.env.EMAIL_PASS, // your Brevo SMTP key
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) console.error("❌ Email transporter error:", error);
  else console.log("✅ Email transporter ready (Brevo)");
});

export default transporter;
