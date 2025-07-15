import React from "react";
import { FaLock, FaCloudUploadAlt, FaCloudDownloadAlt, FaHistory, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

const SecureSafe = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <FaShieldAlt /> Secure & Safe
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaLock /> Login & Authentication
          </h3>
          <p className="text-gray-600">Your data is protected with secure JWT/Firebase-based authentication.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaCloudUploadAlt /> Automatic Backup
          </h3>
          <p className="text-gray-600">Scheduled and manual backups are saved securely to the cloud.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaCloudDownloadAlt /> Restore Records
          </h3>
          <p className="text-gray-600">Restore your previous records anytime from cloud backup storage.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaHistory /> Backup History Logs
          </h3>
          <p className="text-gray-600">View and manage all past backup and restore logs.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaSignOutAlt /> Logout from All Devices
          </h3>
          <p className="text-gray-600">Logout from all your sessions remotely for enhanced account security.</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaShieldAlt /> Privacy & Data Policy
          </h3>
          <p className="text-gray-600">We follow strict data handling policies and use strong encryption to secure your data.</p>
        </div>
      </div>
    </div>
  );
};

export default SecureSafe;