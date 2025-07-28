import React, { useEffect, useState } from "react";
import axios from "axios";

// Define a type for the notification object
type NotificationType = {
  _id: string;
  title: string;
  message: string;
  createdAt?: string;
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/notifications/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications || []);
      } catch (err: any) {
        console.error("Failed to fetch notifications:", err);
        setError("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    } else {
      setError("You must be logged in to view notifications.");
      setLoading(false);
    }
  }, [token, API_BASE]);

  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!notifications.length) return <div className="p-4">No notifications available.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((notif) => (
          <li key={notif._id} className="p-4 border rounded-lg bg-white shadow">
            <h3 className="text-lg font-bold text-gray-800">{notif.title}</h3>
            <p className="text-gray-700">{notif.message}</p>
            {notif.createdAt && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
