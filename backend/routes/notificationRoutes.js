import express from "express";
import Notification from "../models/notification.js";

const router = express.Router();

// ✅ Get all notifications (latest first)
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
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error });
  }
});

export default router;
