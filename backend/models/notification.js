import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["customer", "income", "expense", "due", "reminder"],
    required: true,
  },
  date: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  isMuted: { type: Boolean, default: false }, // ✅ Added for mute/unmute
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
