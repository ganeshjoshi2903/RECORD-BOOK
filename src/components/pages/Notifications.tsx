import { useEffect, useState } from "react";
import axios from "axios";

interface Notification {
  _id: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  if (loading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 rounded-lg shadow border flex justify-between items-center
                ${n.type === "reminder" ? "bg-yellow-100 border-yellow-400" : "bg-white border-gray-200"}
              `}
            >
              <div
                className="cursor-pointer"
                onClick={() => !n.isRead && markAsRead(n._id)}
              >
                <p className="font-medium">{n.message}</p>
                <small className="text-gray-500">
                  {new Date(n.date).toLocaleString()}
                </small>
              </div>
              <div className="flex items-center gap-2">
                {!n.isRead && (
                  <span className="text-xs font-semibold text-red-500">
                    {n.type === "reminder" ? "REMINDER" : "NEW"}
                  </span>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-xs text-gray-600 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
