import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createNotification = async (req, res) => {
  const { title, message } = req.body;
  const userId = req.user.id;

  try {
    const newNotification = new Notification({ userId, title, message });
    await newNotification.save();

    res.status(201).json({ message: 'Notification created' });
  } catch (error) {
    console.error('Create notification error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
