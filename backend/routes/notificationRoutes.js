// backend/routes/notificationRoutes.js
import express from "express";
import Notification from "../models/notification.js";

const router = express.Router();

/**
 * Helper: build filter based on authentication (if you have req.user)
 * If you don't use auth, req.user will be undefined and it will return global notifications.
 */
function buildUserFilter(req, extra = {}) {
  if (req.user && req.user._id) {
    return { user: req.user._id, ...extra };
  }
  return { ...extra };
}

// GET /api/notifications/    => all notifications (newest first, optional user filter)
router.get("/", async (req, res) => {
  try {
    const filter = buildUserFilter(req);
    const notifications = await Notification.find(filter).sort({ date: -1 }).limit(200);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

// GET /api/notifications/unread  => { unread: true/false, count: N }
router.get("/unread", async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const count = await Notification.countDocuments(filter);
    res.json({ unread: count > 0, count });
  } catch (error) {
    res.status(500).json({ message: "Error checking unread notifications", error: error.message });
  }
});

// POST /api/notifications  => create new notification (use in server-side when generating)
router.post("/", async (req, res) => {
  try {
    const { message, type, user, isMuted } = req.body;
    const notif = new Notification({ message, type, user, isMuted });
    await notif.save();
    res.status(201).json(notif);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

// PATCH /api/notifications/:id/read  => mark single notification as read
router.patch("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error marking as read", error: error.message });
  }
});

// PATCH /api/notifications/read-all  => mark all unread as read (for user or global)
router.patch("/read-all", async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const result = await Notification.updateMany(filter, { $set: { isRead: true } });
    // result.modifiedCount for newer mongoose, result.nModified for older
    const modified = result.modifiedCount ?? result.nModified ?? 0;
    res.json({ success: true, modifiedCount: modified });
  } catch (error) {
    res.status(500).json({ message: "Error marking all as read", error: error.message });
  }
});

// PATCH /api/notifications/mute/reminders  => mute/unmute reminder-type notifications
router.patch("/mute/reminders", async (req, res) => {
  try {
    const { mute } = req.body; // boolean
    const filter = buildUserFilter(req, { type: "reminder" });
    await Notification.updateMany(filter, { isMuted: Boolean(mute) });
    res.json({ success: true, muted: Boolean(mute) });
  } catch (error) {
    res.status(500).json({ message: "Error updating reminders mute state", error: error.message });
  }
});

// DELETE /api/notifications/:id
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
});

export default router;
