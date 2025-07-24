import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditSubmit = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/auth/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/auth/profile/password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert("Error updating password");
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Username:</span>
              <p className="text-gray-800 font-medium">{profile.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="text-gray-800 font-medium">{profile.email}</p>
            </div>
            <div>
              <span className="text-gray-500">User ID:</span>
              <p className="text-gray-800 font-mono text-xs">{profile._id}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
          <button
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-3 border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-3 border rounded px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="w-full mb-3 border rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full mb-3 border rounded px-3 py-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
