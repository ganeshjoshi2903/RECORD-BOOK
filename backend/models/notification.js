// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
