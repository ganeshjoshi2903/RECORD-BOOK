// backend/models/notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["customer", "income", "expense", "due", "reminder"],
    required: true,
  },
  // optional: if you have per-user notifications, store reference here
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false, index: true },
  isMuted: { type: Boolean, default: false },
});

// indexes to speed up queries
notificationSchema.index({ isRead: 1, date: -1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
