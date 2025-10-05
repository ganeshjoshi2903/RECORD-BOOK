import Notification from "../models/notification.js";
import User from "../models/User.js";
import MuteSetting from "../models/muteSetting.js";

// ✅ Helper function: builds filter for current user
const buildUserFilter = (req, extra = {}) => {
  const uid = req.user?._id ?? req.user?.id;
  return uid ? { user: uid, ...extra } : { ...extra };
};

// ✅ Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const filter = buildUserFilter(req);

    // Exclude reminders if muted
    const muteSetting = await MuteSetting.findOne({ key: "reminder" });
    const isMuted = muteSetting?.isMuted ?? false;
    if (isMuted) {
      filter.type = { $ne: "reminder" };
    }

    const notifications = await Notification.find(filter)
      .sort({ date: -1 })
      .limit(200);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create notification (skip reminders if muted)
export const createNotification = async (req, res) => {
  try {
    const { message, type } = req.body;
    const userId = req.user?._id ?? req.user?.id ?? req.body.user;

    if (!userId) return res.status(400).json({ message: "User required" });

    // Skip reminder if muted
    if (type === "reminder") {
      const muteSetting = await MuteSetting.findOne({ key: "reminder" });
      if (muteSetting?.isMuted) {
        return res.status(200).json({
          success: false,
          message: "Reminder notifications are muted.",
        });
      }
    }

    const notif = new Notification({ message, type, user: userId });
    await notif.save();

    res.status(201).json({ success: true, notif });
  } catch (err) {
    console.error("Create notification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const count = await Notification.countDocuments(filter);
    res.status(200).json({ unread: count > 0, count });
  } catch (err) {
    console.error("Unread count error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Mark single notification as read
export const markAsReadNotification = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Mark read error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const filter = buildUserFilter(req, { isRead: false });
    const result = await Notification.updateMany(filter, {
      $set: { isRead: true },
    });

    const modified = result.modifiedCount ?? result.nModified ?? 0;
    res.status(200).json({ success: true, modifiedCount: modified });
  } catch (err) {
    console.error("Mark all read error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete one notification
export const deleteNotification = async (req, res) => {
  try {
    const removed = await Notification.findByIdAndDelete(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get mute setting for reminders
export const getMuteReminders = async (req, res) => {
  try {
    let setting = await MuteSetting.findOne({ key: "reminder" });
    if (!setting) {
      setting = new MuteSetting({ key: "reminder", isMuted: false });
      await setting.save();
    }
    res.status(200).json({ muted: setting.isMuted });
  } catch (err) {
    console.error("Get mute state error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Toggle mute reminder setting
export const updateMuteReminders = async (req, res) => {
  try {
    const { mute } = req.body;
    const setting = await MuteSetting.findOneAndUpdate(
      { key: "reminder" },
      { isMuted: Boolean(mute) },
      { new: true, upsert: true }
    );
    res.status(200).json({
      success: true,
      muted: setting.isMuted,
      message: setting.isMuted
        ? "Reminder notifications muted."
        : "Reminder notifications unmuted.",
    });
  } catch (err) {
    console.error("Update mute error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
