import cron from "node-cron";
import DigitalRecord from "./models/DigitalRecord.js";
import Notification from "./models/notification.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected for cron job"))
.catch((err) => console.error("❌ MongoDB cron error:", err));

// Run every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Running daily due reminder check...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch Due records where status = due
    const dueRecords = await DigitalRecord.find({
      type: "Due",
      status: "due",
      dueDate: { $gte: today },
    });

    for (const record of dueRecords) {
      const due = new Date(record.dueDate);
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (reminderDate.getTime() === now.getTime()) {
        // Check if reminder already exists
        const exists = await Notification.findOne({
          message: `Reminder: Due of ₹${record.amount} is tomorrow (${due.toLocaleDateString()})`,
          type: "reminder",
        });

        if (!exists) {
          await Notification.create({
            message: `Reminder: Due of ₹${record.amount} is tomorrow (${due.toLocaleDateString()})`,
            type: "reminder",
          });
          console.log(`🔔 Reminder created for ₹${record.amount}`);
        }
      }
    }
  } catch (err) {
    console.error("❌ Error running cron due reminder:", err.message);
  }
});