import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  CheckCircle,
  Volume2,
  VolumeX,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createPortal } from "react-dom";

interface Notification {
  _id: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
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

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const showToast = (message: ToastMessage) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async (markAllRead = false) => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications`, axiosConfig);
      let data: Notification[] = res.data;

      if (muted) data = data.filter((n) => n.type !== "reminder");

      setNotifications(data);

      if (markAllRead && data.length > 0) {
        const unreadIds = data
          .filter((n: Notification) => !n.isRead)
          .map((n: Notification) => n._id);

        await Promise.all(
          unreadIds.map((id) =>
            axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, axiosConfig)
          )
        );

        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      }
    } catch {
      showToast({ type: "error", text: "Failed to load notifications." });
    } finally {
      setLoading(false);
    }
  };

  const fetchMuteState = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/mute/reminder`, axiosConfig);
      setMuted(res.data.muted);
    } catch {
      showToast({ type: "error", text: "Failed to fetch mute state." });
    }
  };

  const toggleGlobalMute = async () => {
    try {
      const newMute = !muted;
      await axios.patch(
        `${API_URL}/api/mute/reminder`,
        { mute: newMute },
        axiosConfig
      );
      setMuted(newMute);
      showToast({
        type: "success",
        text: `Reminders ${newMute ? "muted" : "unmuted"}.`,
      });
      fetchNotifications();
    } catch {
      showToast({ type: "error", text: "Failed to toggle mute." });
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, axiosConfig);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      showToast({ type: "error", text: "Failed to mark as read." });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, axiosConfig);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      showToast({ type: "success", text: "Notification deleted." });
    } catch {
      showToast({ type: "error", text: "Failed to delete notification." });
    }
  };

  useEffect(() => {
    if (token) {
      fetchMuteState().then(() => fetchNotifications(true));
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
      <div className="max-w-xl mx-auto p-8 rounded-3xl shadow-xl bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Notifications
          </h1>
          <button
            onClick={toggleGlobalMute}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              muted
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-600 hover:bg-green-100"
            }`}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            {muted ? "Unmute Reminders" : "Mute Reminders"}
          </button>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No notifications yet 🎉
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-4 rounded-xl shadow-md border-l-4 ${
                  n.isRead
                    ? "bg-gray-50 border-gray-300"
                    : "bg-white border-indigo-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 pr-4">
                    <p
                      className={`font-medium ${
                        n.isRead ? "text-gray-500" : "text-gray-800"
                      }`}
                    >
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
                      className="p-2 rounded-full hover:bg-green-100 text-green-600"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => deleteNotification(n._id)}
                      className="p-2 rounded-full hover:bg-red-100 text-red-600"
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

      {/* Toast */}
      {toast &&
        createPortal(
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-5 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 z-50 ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.text}
          </div>,
          document.body
        )}
    </div>
  );
}
