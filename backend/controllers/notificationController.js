// 📂 backend/controllers/notificationController.js
import Notification from "../models/notification.js";
import User from "../models/User.js"; // ensure path matches
// NOTE: keep import names/casing exactly as your project

// ✅ Get all notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await Notification.find({ user: userId })
      .sort({ date: -1 })
      .limit(200);

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Create a new notification for a target user (checks that user's muteReminders)
export const createNotification = async (req, res) => {
  try {
    const { message, type, user: targetUserId } = req.body;
    // targetUserId: required to know who receives this notification
    if (!targetUserId) {
      return res.status(400).json({ message: "Target user is required" });
    }

    // If it's a reminder, check target user's muteReminders
    if (type === "reminder") {
      const targetUser = await User.findById(targetUserId);
      if (!targetUser) return res.status(404).json({ message: "Target user not found" });
      if (targetUser.muteReminders) {
        // skip creating reminder for this user
        return res.status(200).json({ success: false, message: "User has muted reminders" });
      }
    }

    const newNotification = new Notification({
      message,
      type,
      user: targetUserId,
    });

    await newNotification.save();
    res.status(201).json({ success: true, notif: newNotification });
  } catch (err) {
    console.error("Create notification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a notification (owner-only)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    const userId = req.user?.id ?? req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (notif.user?.toString() !== userId) return res.status(403).json({ message: "Not allowed" });

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Mark notification as read
export const markAsReadNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    const userId = req.user?.id ?? req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (notif.user?.toString() !== userId) return res.status(403).json({ message: "Not allowed" });

    notif.isRead = true;
    await notif.save();

    res.status(200).json(notif);
  } catch (err) {
    console.error("Mark as read error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const toggleUserMuteReminders = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { mute } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.muteReminders = Boolean(mute);
    await user.save();

    res.status(200).json({ success: true, muted: user.muteReminders });
  } catch (err) {
    console.error("Toggle user mute error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const count = await Notification.countDocuments({ user: userId, isRead: false });
    res.json({ unread: count > 0, count });
  } catch (err) {
    console.error("Unread count error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
