import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Bell,
  UserCircle,
  User,
} from 'lucide-react';

const DashboardLayout = () => {
  const links = [
    { name: 'Digital Records', path: 'records', icon: BookOpen },
    { name: 'Customer Management', path: 'customers', icon: Users },
    { name: 'Business Reports', path: 'reports', icon: TrendingUp },
    { name: 'Secure & Safe', path: 'security', icon: Shield },
    { name: 'Notifications', path: 'notifications', icon: Bell },
    { name: 'Profile', path: 'profile', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 shadow-md border-r border-blue-100">
        <div className="p-6 text-xl font-bold text-blue-700">Record Book</div>
        <nav className="space-y-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={`/dashboard/${link.path}`}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-md text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-100 text-blue-800 font-semibold'
                    : 'text-gray-700 hover:bg-blue-100'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white px-6 py-4 border-b shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <NavLink
              to="/dashboard/notifications"
              className="relative text-gray-600 hover:text-gray-900"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </NavLink>

            {/* User Profile */}
            <NavLink
              to="/dashboard/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <UserCircle className="w-6 h-6" />
              <span className="text-sm font-medium">user@gmail.com</span>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
