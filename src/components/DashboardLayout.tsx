import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Users, TrendingDown, Bell, User, LogOut, LayoutDashboard } from "lucide-react";
import api from "../../api";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  // ✅ Check unread notifications
  const checkHasUnreadNotifications = async () => {
    try {
      const res = await api.get("/api/notifications/unread", axiosConfig);
      setHasUnread(res.data.unread === true || res.data.count > 0);
    } catch (err) {
      console.error("Notification check failed:", err);
      setHasUnread(false);
    }
  };

  // ✅ Mark all notifications as read when user visits Notifications page
  const markAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/read-all", {}, axiosConfig);
      setHasUnread(false);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  useEffect(() => {
    checkHasUnreadNotifications();
    const interval = setInterval(checkHasUnreadNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname === "/dashboard/notifications") {
      markAllAsRead();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", path: "", icon: LayoutDashboard },
    { name: "Digital Records", path: "records", icon: BookOpen },
    { name: "Customer Management", path: "customers", icon: Users },
    { name: "Due Tracker", path: "dues", icon: TrendingDown },
    { name: "Notifications", path: "notifications", icon: Bell },
    { name: "Profile", path: "profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 font-sans antialiased">
      <aside className="w-64 bg-white shadow-xl border-r border-blue-100 py-6 flex flex-col z-20">
        <div className="px-6 pb-8 text-3xl font-extrabold text-blue-700 tracking-tight">Record Book</div>
        <nav className="space-y-2 px-4 flex-grow">
          {links.map((link) => {
            const isActive =
              location.pathname === `/dashboard/${link.path}` ||
              (link.path === "" && location.pathname === "/dashboard");
            return (
              <NavLink
                key={link.path || "dashboard-root"}
                to={`/dashboard/${link.path}`}
                className={`flex items-center space-x-4 p-3.5 rounded-xl text-base transition-all duration-250 ease-in-out transform ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg scale-[1.02] font-semibold"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                } group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
              >
                <link.icon
                  className={`w-6 h-6 ${isActive ? "text-white" : "text-blue-500 group-hover:text-blue-700"} transition-colors duration-250`}
                />
                <span className="font-medium">{link.name}</span>
                {link.name === "Notifications" && hasUnread && (
                  <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-6 pt-4 mt-auto border-t border-gray-100 text-gray-500 text-xs text-center">
          <p>&copy; 2025 Record Book. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative z-10">
        <header className="flex justify-between items-center bg-white px-10 py-5 border-b border-gray-100 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-6">
            <NavLink
              to="/dashboard/notifications"
              className="relative text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />}
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 shadow-sm"
              title="Profile"
            >
              <User className="w-6 h-6 text-blue-700" />
            </NavLink>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-full shadow-lg transition-all duration-250 transform hover:scale-105 active:scale-95 text-base font-semibold"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 bg-gray-100 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 min-h-[calc(100vh-180px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
