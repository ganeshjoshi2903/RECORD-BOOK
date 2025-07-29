import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Key, Edit, X, Save, Lock, Info, AlertCircle } from "lucide-react"; // Import Lucide icons

// Define interfaces for better type safety
interface ProfileData {
  _id: string;
  name: string;
  email: string;
  // Add other profile properties if they exist in your backend response
}

interface FormData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
  });

  // Get token once and reuse
  const token = localStorage.getItem("token");

  // Function to display temporary messages
  const showTemporaryMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000); // Message disappears after 3 seconds
    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.error("No token found. User not authenticated.");
        setLoadingMessage("Please log in to view your profile.");
        return;
      }

      try {
        const res = await axios.get<ProfileData>("http://localhost:8000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setLoadingMessage("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, [token]); // Dependency array ensures fetchProfile runs if token changes

  // Handle profile edit form submission
  const handleEditSubmit = async () => {
    if (!token) return; // Ensure token exists

    try {
      const res = await axios.put<ProfileData>(
        "http://localhost:8000/api/auth/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data); // Update profile state with new data
      setShowEditModal(false); // Close the modal
      showTemporaryMessage('success', 'Profile updated successfully!'); // Show success message
    } catch (err: any) {
      console.error("Update failed:", err);
      showTemporaryMessage('error', err.response?.data?.message || 'Failed to update profile.'); // Show error message
    }
  };

  // Handle password change form submission
  const handlePasswordSubmit = async () => {
    if (!token) return; // Ensure token exists

    if (passwordData.newPassword.length < 6) {
      showTemporaryMessage('error', 'New password must be at least 6 characters long.');
      return;
    }

    try {
      await axios.put(
        "http://localhost:8000/api/auth/profile/password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showTemporaryMessage('success', 'Password updated successfully!'); // Show success message
      setShowPasswordModal(false); // Close the modal
      setPasswordData({ currentPassword: "", newPassword: "" }); // Clear password fields
    } catch (err: any) {
      console.error("Error updating password:", err);
      showTemporaryMessage('error', err.response?.data?.message || 'Error updating password. Please check your current password.'); // Show error message
    }
  };

  // Message for loading state
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading profile...");

  // Display loading message if profile data is not yet loaded
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500 text-xl animate-pulse">{loadingMessage}</p>
      </div>
    );
  }

  // Main Profile Page JSX
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 font-inter"> {/* Reduced py and px */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-blue-100 relative overflow-hidden"> {/* Reduced padding, rounded-2xl */}
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>

        {/* Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 relative z-10"> {/* Reduced gap and mb */}
          {/* User Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-blue-200 ring-opacity-75 transform transition-transform duration-300 hover:scale-105"> {/* Reduced size, text size */}
            {profile.name.charAt(0).toUpperCase()}
          </div>
          {/* User Name and Email */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1">{profile.name}</h2> {/* Reduced text size */}
            <p className="text-base text-gray-600 font-medium flex items-center justify-center md:justify-start gap-2"> {/* Reduced text size */}
              <Mail className="w-4 h-4 text-blue-500" /> {profile.email} {/* Reduced icon size */}
            </p>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="mt-8 relative z-10">
          <h3 className="text-xl font-bold text-gray-800 mb-5 border-b pb-2 border-gray-200">Account Information</h3> {/* Reduced text size, mb, pb */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-base"> {/* Reduced gaps */}
            {/* Username */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"> {/* Reduced gap and padding */}
              <User className="w-5 h-5 text-indigo-500 flex-shrink-0" /> {/* Reduced icon size */}
              <div>
                <p className="text-gray-500 text-sm mb-0.5">Username</p>
                <p className="text-gray-800 font-semibold">{profile.name}</p>
              </div>
            </div>
            {/* Email */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"> {/* Reduced gap and padding */}
              <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" /> {/* Reduced icon size */}
              <div>
                <p className="text-gray-500 text-sm mb-0.5">Email</p>
                <p className="text-gray-800 font-semibold">{profile.email}</p>
              </div>
            </div>
            {/* User ID */}
            <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"> {/* Reduced gap and padding */}
              <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" /> {/* Reduced icon size */}
              <div>
                <p className="text-gray-500 text-sm mb-0.5">User ID</p>
                <p className="text-gray-700 font-mono text-sm break-all">{profile._id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start relative z-10"> {/* Reduced mt and gap */}
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Reduced py, px, rounded, hover translate
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
          <button
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50" // Reduced py, px, rounded, hover translate
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock className="w-4 h-4" /> Change Password
          </button>
        </div>

        {/* Temporary Message Display */}
        {message && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-lg shadow-xl text-white flex items-center gap-2 animate-fade-in-up transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}> {/* Reduced px, py, gap */}
            {message.type === 'success' ? <Save className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm">{message.text}</span> {/* Reduced text size */}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-md transform scale-95 animate-scale-in"> {/* Reduced padding, rounded-xl */}
            <div className="flex justify-between items-center mb-5"> {/* Reduced mb */}
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2> {/* Reduced text size */}
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 transition">
                <X className="w-5 h-5" /> {/* Reduced icon size */}
              </button>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-3 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm" // Reduced p, mb, text size
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-5 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm" // Reduced p, mb, text size
            />
            <div className="flex justify-end gap-2"> {/* Reduced gap */}
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm" // Reduced px, py, rounded, text size
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md text-sm" // Reduced px, py, rounded, text size
              >
                <Save className="inline-block w-3.5 h-3.5 mr-1.5" /> Save Changes {/* Reduced icon size, mr */}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[95%] max-w-md transform scale-95 animate-scale-in"> {/* Reduced padding, rounded-xl */}
            <div className="flex justify-between items-center mb-5"> {/* Reduced mb */}
              <h2 className="text-xl font-bold text-gray-800">Change Password</h2> {/* Reduced text size */}
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700 transition">
                <X className="w-5 h-5" /> {/* Reduced icon size */}
              </button>
            </div>
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, currentPassword: e.target.value })
              }
              className="w-full mb-3 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm" // Reduced p, mb, text size
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full mb-5 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm" // Reduced p, mb, text size
            />
            <div className="flex justify-end gap-2"> {/* Reduced gap */}
              <button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm" // Reduced px, py, rounded, text size
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md text-sm" // Reduced px, py, rounded, text size
              >
                <Key className="inline-block w-3.5 h-3.5 mr-1.5" /> Update Password {/* Reduced icon size, mr */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
