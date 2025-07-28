import React from "react";
import {
  FaLock,
  FaCloudUploadAlt,
  FaCloudDownloadAlt,
  FaHistory,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaLock className="text-blue-600" />,
    title: "Login & Authentication",
    description: "Your data is protected with secure JWT/Firebase-based authentication.",
  },
  {
    icon: <FaCloudUploadAlt className="text-green-600" />,
    title: "Automatic Backup",
    description: "Scheduled and manual backups are saved securely to the cloud.",
  },
  {
    icon: <FaCloudDownloadAlt className="text-purple-600" />,
    title: "Restore Records",
    description: "Restore your previous records anytime from cloud backup storage.",
  },
  {
    icon: <FaHistory className="text-yellow-600" />,
    title: "Backup History Logs",
    description: "View and manage all past backup and restore logs.",
  },
  {
    icon: <FaSignOutAlt className="text-red-600" />,
    title: "Logout from All Devices",
    description: "Logout from all your sessions remotely for enhanced account security.",
  },
  {
    icon: <FaShieldAlt className="text-pink-600" />,
    title: "Privacy & Data Policy",
    description: "We follow strict data handling policies and use strong encryption to secure your data.",
  },
];

const SecureSafe = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-3">
        <FaShieldAlt /> Secure & Safe
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-3 text-xl font-semibold">
              {feature.icon}
              {feature.title}
            </div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecureSafe;
