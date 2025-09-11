// 📂 backend/routes/notificationRoutes.js
import express from "express";
import Notification from "../models/notification.js";
import MuteSetting from "../models/mutesettings.js"; // Ensure filename matches exactly

const router = express.Router();

/**
 * Helper: build filter based on authentication (if you have req.user)
 */
function buildUserFilter(req, extra = {}) {
  if (req.user && req.user._id) {
    return { user: req.user._id, ...extra };
  }
  return { ...extra };
}

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications (checks mute state)
 */
router.get("/", async (req, res) => {
  try {
    const filter = buildUserFilter(req);

    // Check mute state
    const muteSetting = await MuteSetting.findOne({ key: "reminder" });
    const isMuted = muteSetting?.isMuted ?? false;

    if (isMuted) {
      filter.type = { $ne: "reminder" };
    }

    const notifications = await Notification.find(filter)
      .sort({ date: -1 })
      .limit(200);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching notifications",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/notifications/unread
 * @desc    Check unread notifications count
 */
router.get("/unread", async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const count = await Notification.countDocuments(filter);
    res.json({ unread: count > 0, count });
  } catch (error) {
    res.status(500).json({
      message: "Error checking unread notifications",
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/notifications
 * @desc    Create new notification (checks mute state for reminders)
 */
router.post("/", async (req, res) => {
  try {
    const { message, type, user } = req.body;

    // Only allow reminder notifications if not muted
    if (type === "reminder") {
      const setting = await MuteSetting.findOne({ key: "reminder" });
      if (setting?.isMuted) {
        return res.status(200).json({
          success: false,
          message: "Reminder notifications are muted",
        });
      }
    }

    const notif = new Notification({ message, type, user });
    await notif.save();
    res.status(201).json({ success: true, notif });
  } catch (error) {
    res.status(500).json({
      message: "Error creating notification",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark a single notification as read
 */
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Error marking as read",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 */
router.patch("/read-all", async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const result = await Notification.updateMany(filter, { $set: { isRead: true } });
    const modified = result.modifiedCount ?? result.nModified ?? 0;
    res.json({ success: true, modifiedCount: modified });
  } catch (error) {
    res.status(500).json({
      message: "Error marking all as read",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/notifications/mute/reminders
 * @desc    Get current mute state
 */
router.get("/mute/reminders", async (req, res) => {
  try {
    let setting = await MuteSetting.findOne({ key: "reminder" });
    if (!setting) {
      setting = new MuteSetting({ key: "reminder", isMuted: false });
      await setting.save();
    }
    res.json({ muted: setting.isMuted });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching mute state",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/notifications/mute/reminders
 * @desc    Toggle mute state for reminders
 */
router.patch("/mute/reminders", async (req, res) => {
  try {
    const { mute } = req.body;
    let setting = await MuteSetting.findOneAndUpdate(
      { key: "reminder" },
      { isMuted: Boolean(mute) },
      { new: true, upsert: true }
    );
    res.json({ success: true, muted: setting.isMuted });
  } catch (error) {
    res.status(500).json({
      message: "Error updating mute state",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 */
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting notification",
      error: error.message,
    });
  }
});

export default router;
