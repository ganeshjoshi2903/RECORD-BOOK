import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Trash2, CheckCircle } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
  isMuted?: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
  const token = localStorage.getItem("token");

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications`, axiosConfig);
      setNotifications(res.data);

      // check if reminders are muted
      const remindersMuted = res.data.some((n: Notification) => n.type === "reminder" && n.isMuted);
      setMuted(remindersMuted);
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${id}`, axiosConfig);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/api/notifications/${id}/read`, {}, axiosConfig);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  // 🔇 Global mute/unmute reminders
  const toggleGlobalMute = async () => {
    try {
      const newMute = !muted;
      await axios.patch(
        `${API_BASE}/api/notifications/mute/reminders`,
        { mute: newMute },
        axiosConfig
      );
      setMuted(newMute);
      fetchNotifications(); // refresh list
    } catch (err) {
      console.error("❌ Failed to toggle mute:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-6">⏳ Loading notifications...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        <button
          onClick={toggleGlobalMute}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            muted
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {muted ? "Unmute Reminders" : "Mute Reminders"}
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No notifications yet 🎉</p>
      ) : (
        <ul className="space-y-4">
          {notifications
            .filter((n) => !(muted && n.type === "reminder")) // hide reminders if muted
            .map((n) => (
              <li
                key={n._id}
                className={`p-4 rounded-2xl shadow-md border flex justify-between items-center transition-all hover:shadow-lg
                  ${n.type === "reminder"
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-white border-gray-200"
                  }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => !n.isRead && markAsRead(n._id)}
                >
                  <p className={`font-medium ${n.isRead ? "text-gray-500" : "text-gray-800"}`}>
                    {n.message}
                  </p>
                  <small className="text-gray-400">
                    {new Date(n.date).toLocaleString()}
                  </small>
                </div>

                <div className="flex items-center gap-3">
                  {!n.isRead && (
                    <span className="px-2 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-600">
                      {n.type === "reminder" ? "REMINDER" : "NEW"}
                    </span>
                  )}

                  <button
                    onClick={() => markAsRead(n._id)}
                    className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
