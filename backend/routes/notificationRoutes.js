import express from "express";
import Notification from "../models/notification.js";
import MuteSetting from "../models/muteSetting.js";

const router = express.Router();

/**
 * 🔹 Helper: Build filter with user context
 */
function buildUserFilter(req, extra = {}) {
  if (req.user && (req.user._id || req.user.id)) {
    const uid = req.user._id ?? req.user.id;
    return { user: uid, ...extra };
  }
  return { ...extra };
}

/**
 * 🔹 GET /api/notifications
 * Fetch all notifications (exclude reminders if muted)
 */
router.get("/", async (req, res) => {
  try {
    const filter = buildUserFilter(req);

    // Check mute setting
    const muteSetting = await MuteSetting.findOne({ key: "reminder" });
    const isMuted = muteSetting?.isMuted ?? false;

    if (isMuted) {
      filter.type = { $ne: "reminder" }; // exclude reminders
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
 * 🔹 GET /api/notifications/unread
 * Count unread
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
 * 🔹 POST /api/notifications
 * Create notification (skip reminder if muted)
 */
router.post("/", async (req, res) => {
  try {
    const { message, type } = req.body;
    const user =
      req.user && (req.user._id ?? req.user.id)
        ? req.user._id ?? req.user.id
        : req.body.user;

    if (type === "reminder") {
      const setting = await MuteSetting.findOne({ key: "reminder" });
      if (setting?.isMuted) {
        return res.status(200).json({
          success: false,
          message: "Reminder notifications are muted.",
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
 * 🔹 PATCH /api/notifications/:id/read
 */
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Notification not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Error marking as read",
      error: error.message,
    });
  }
});

/**
 * 🔹 PATCH /api/notifications/read-all
 */
router.patch("/read-all", async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const result = await Notification.updateMany(filter, {
      $set: { isRead: true },
    });
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
 * 🔹 GET /api/notifications/mute/reminders
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
 * 🔹 PATCH /api/notifications/mute/reminders
 * Body: { mute: boolean }
 */
router.patch("/mute/reminders", async (req, res) => {
  try {
    const { mute } = req.body;
    const setting = await MuteSetting.findOneAndUpdate(
      { key: "reminder" },
      { isMuted: Boolean(mute) },
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      muted: setting.isMuted,
      message: setting.isMuted
        ? "Reminder notifications muted."
        : "Reminder notifications unmuted.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating mute state",
      error: error.message,
    });
  }
});

/**
 * 🔹 DELETE /api/notifications/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Notification.findByIdAndDelete(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting notification",
      error: error.message,
    });
  }
});

export default router;
