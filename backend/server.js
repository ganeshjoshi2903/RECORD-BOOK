import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

// Routes
import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/digitalRecordRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import profileRoutes from "./routes/profileroutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import muteRoutes from "./routes/muteroutes.js";

// Models
import DigitalRecord from "./models/DigitalRecord.js";
import Notification from "./models/notification.js";
import MuteSetting from "./models/muteSetting.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// 🔹 CORS Setup (handles preflight OPTIONS requests)
const allowedOrigins = [
  "http://localhost:5173",
  "https://recordbook-frontend.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Preflight handling (optional but safer)
app.options("*", cors());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/mute", muteRoutes);

// 🔹 Root
app.get("/", (req, res) => res.send("✅ RecordBook Backend is Live!"));

// 🔹 Cron job: daily reminders at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const muteSetting = await MuteSetting.findOne({ key: "reminder" });
    if (muteSetting?.isMuted) {
      console.log("🔕 Reminders muted — skipping cron");
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfDay = new Date(tomorrow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tomorrow);
    endOfDay.setHours(23, 59, 59, 999);

    const dues = await DigitalRecord.find({
      type: "Due",
      status: "due",
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    for (const due of dues) {
      const msg = `Reminder: Due of ₹${due.amount} is tomorrow (${new Date(
        due.dueDate
      ).toDateString()})`;

      const exists = await Notification.findOne({ message: msg, type: "reminder" });
      if (!exists) {
        await Notification.create({
          message: msg,
          type: "reminder",
          user: due.user ?? undefined,
        });
        console.log(`🔔 Reminder created for ₹${due.amount}`);
      }
    }

    if (dues.length > 0) {
      console.log(`✅ Total ${dues.length} reminder(s) processed`);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err.message);
  }
});

// 🔹 Connect DB + start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));
