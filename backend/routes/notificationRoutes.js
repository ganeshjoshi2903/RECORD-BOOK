import express from "express";
import Notification from "../models/notification.js";

const router = express.Router();

// ✅ Get all notifications (skip muted reminders if muted)
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});

// ✅ Mark notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error });
  }
});

// ✅ Delete notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
});

// ✅ Global Mute/Unmute Reminders
router.patch("/mute/reminders", async (req, res) => {
  try {
    const { mute } = req.body; // true/false
    await Notification.updateMany(
      { type: "reminder" },
      { isMuted: mute }
    );
    res.json({ success: true, muted: mute });
  } catch (error) {
    res.status(500).json({ message: "Error updating reminders mute state", error });
  }
});

export default router;
