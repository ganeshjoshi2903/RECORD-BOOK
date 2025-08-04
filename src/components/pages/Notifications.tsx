import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/notifications/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  if (!notifications.length) return <div>No notifications available.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Your Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((notif: any, i) => (
          <li key={i} className="border p-3 rounded bg-gray-50 shadow">
            <strong>{notif.title}</strong>
            <p>{notif.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
