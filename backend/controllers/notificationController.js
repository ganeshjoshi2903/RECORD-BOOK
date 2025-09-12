import Notification from "../models/notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const createNotification = async (req, res) => {
  const { title, message, type } = req.body;
  const userId = req.user.id;

  try {
    const newNotification = new Notification({ userId, title, message, type });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    console.error("Create notification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    if (notif.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await notif.remove();
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const markAsReadNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    if (notif.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    notif.isRead = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error("Mark as read error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const toggleMuteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    if (notif.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    notif.isMuted = !notif.isMuted;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error("Toggle mute error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
