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

// Models for cron
import DigitalRecord from "./models/DigitalRecord.js";
import Notification from "./models/notification.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Middleware
app.use(
  cors({
origin: ["http://localhost:5173", "https://recordbook-frontend.onrender.com"],    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ Root
app.get("/", (req, res) => res.send("✅ RecordBook Backend is Live!"));

// ✅ Cron Job: run daily at 00:00 (midnight) to create due reminders
cron.schedule("0 0 * * *", async () => {
  try {
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
      // Check if reminder already exists
      const exists = await Notification.findOne({
        message: `Reminder: Due of ₹${due.amount} is tomorrow (${new Date(
          due.dueDate
        ).toDateString()})`,
        type: "reminder",
      });

      if (!exists) {
        await Notification.create({
          message: `Reminder: Due of ₹${due.amount} is tomorrow (${new Date(
            due.dueDate
          ).toDateString()})`,
          type: "reminder",
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

// ✅ Connect DB + Start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

