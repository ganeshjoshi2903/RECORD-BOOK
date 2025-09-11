import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Trash2, CheckCircle, Volume2, VolumeX, AlertCircle, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

interface Notification {
  _id: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
  isMuted?: boolean;
}

interface ToastMessage {
  type: "success" | "error";
  text: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const API_BASE = "http://localhost:8000";
  const token = localStorage.getItem("token");

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const showToast = (message: ToastMessage) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications`, axiosConfig);
      setNotifications(res.data);
      const remindersMuted = res.data.some((n: Notification) => n.type === "reminder" && n.isMuted);
      setMuted(remindersMuted);
      showToast({ type: "success", text: "Notifications loaded." });
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
      showToast({ type: "error", text: "Failed to load notifications." });
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/api/notifications/${id}`, axiosConfig);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast({ type: "success", text: "Notification deleted." });
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
      showToast({ type: "error", text: "Failed to delete notification." });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_BASE}/api/notifications/${id}/read`, {}, axiosConfig);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      showToast({ type: "success", text: "Marked as read." });
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
      showToast({ type: "error", text: "Failed to mark as read." });
    }
  };

  const toggleGlobalMute = async () => {
    try {
      const newMute = !muted;
      await axios.patch(
        `${API_BASE}/api/notifications/mute/reminders`,
        { mute: newMute },
        axiosConfig
      );
      setMuted(newMute);
      fetchNotifications();
      showToast({ type: "success", text: `Reminders ${newMute ? "muted" : "unmuted"}.` });
    } catch (err) {
      console.error("❌ Failed to toggle mute:", err);
      showToast({ type: "error", text: "Failed to toggle mute." });
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      setLoading(false);
      showToast({ type: "error", text: "Authentication token not found." });
    }
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-lg text-gray-600 bg-gradient-to-br from-indigo-50 to-white">
        <Loader2 className="animate-spin mr-2 text-indigo-500" size={32} />
        <span className="mt-4">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 font-sans text-gray-800">
      <style>
        {`
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(100px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in-up { animation: slide-in-up 0.5s ease-out forwards; }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}
      </style>

      <div className="max-w-xl mx-auto p-8 rounded-3xl shadow-xl bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg transform transition-all duration-500 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          </div>
          <button
            onClick={toggleGlobalMute}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              muted
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            {muted ? "Unmute Reminders" : "Mute Reminders"}
          </button>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-10 flex items-center justify-center gap-2">
            No notifications yet 🎉
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications
              .filter((n) => !(muted && n.type === "reminder"))
              .map((n) => (
                <li
                  key={n._id}
                  className={`p-4 rounded-xl shadow-md border-l-4 transition-all duration-300 hover:shadow-lg
                    ${n.isRead ? "bg-gray-50 border-gray-300" : "bg-white border-indigo-500"}
                    ${n.type === "reminder" && !n.isRead ? "bg-yellow-50 border-yellow-500" : ""}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <p className={`font-medium ${n.isRead ? "text-gray-500" : "text-gray-800"}`}>
                        {n.message}
                      </p>
                      <small className="text-gray-400 text-xs">
                        {new Date(n.date).toLocaleString()}
                      </small>
                    </div>

                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <span className="px-2 py-1 text-xs rounded-full font-semibold bg-red-100 text-red-600">
                          NEW
                        </span>
                      )}
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="p-2 rounded-full hover:bg-green-100 text-green-600 transition"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => deleteNotification(n._id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {toast && createPortal(
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-5 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 z-50 transition-all duration-300 animate-slide-in-up ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.text}
        </div>,
        document.body
      )}
    </div>
  );
}
