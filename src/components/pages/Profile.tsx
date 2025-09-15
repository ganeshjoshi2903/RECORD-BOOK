import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  Save,
  AlertCircle,
  Info,
  X,
  Loader2,
  User,
  KeyRound,
  AtSign,
  UserCog,
  Key,
} from "lucide-react";
import { createPortal } from "react-dom";

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface FormData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData({ name: res.data.name, email: res.data.email });
    } catch (err) {
      setMessage({ type: "error", text: "❌ Failed to load profile." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
    else {
      setMessage({ type: "error", text: "⚠️ No token found. Please log in." });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEditSubmit = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`${API_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setShowEditModal(false);
      setMessage({ type: "success", text: "✅ Profile updated successfully!" });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "❌ Failed to update profile.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_URL}/api/profile/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordModal(false);
      setMessage({ type: "success", text: "✅ Password updated!" });
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "❌ Error updating password.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const MemoizedProfileDisplay = React.memo(() => {
    if (loading) {
      return (
        <div className="h-screen flex flex-col justify-center items-center text-lg text-gray-600">
          <Loader2 className="animate-spin mr-2 text-purple-500" size={32} />
          <span className="mt-4">Loading profile...</span>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="h-screen flex flex-col justify-center items-center text-lg text-red-500">
          <AlertCircle className="mr-2" size={32} />
          <span className="mt-4">Profile not found.</span>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-white/30 backdrop-blur-lg shadow-xl border border-white/40">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          <div className="flex-shrink-0 relative mb-6 md:mb-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-5xl font-bold flex items-center justify-center shadow-lg ring-4 ring-purple-300">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{profile.name}</h2>
            <p className="text-lg text-gray-600 flex items-center justify-center md:justify-start gap-2 mb-3">
              <Mail size={20} className="text-purple-500" /> {profile.email}
            </p>
            {profile.createdAt && (
              <p className="text-sm text-gray-500">
                Member since{" "}
                <span className="font-semibold">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </p>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
              >
                <UserCog size={20} /> Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200 hover:scale-105 transition-transform"
              >
                <Key size={20} /> Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-gray-50/80 border border-gray-200 shadow-inner">
          <p className="text-base text-gray-700 font-medium">
            <Info size={16} className="inline mr-2 text-purple-500" />
            <span className="text-gray-900">User ID:</span>{" "}
            <code className="text-gray-600 break-all">{profile._id}</code>
          </p>
        </div>
      </div>
    );
  });

  const MemoizedMessage = React.memo(() => {
    return (
      <>
        {message && (
          <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-xl text-sm flex items-center gap-2 z-50 transition-all duration-300 animate-slide-in-up ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.type === "success" ? <Save size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}
      </>
    );
  });

  const MemoizedModal = React.memo(
    ({
      title,
      onClose,
      onSave,
      saving,
      children,
    }: {
      title: string;
      onClose: () => void;
      onSave: () => void;
      saving: boolean;
      children: React.ReactNode;
    }) => {
      return createPortal(
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-scale-in">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <X
                size={22}
                className="cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={onClose}
              />
            </div>
            {children}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={onSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      );
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-white py-16 px-4 font-sans text-gray-800">
      <style>
        {`
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(100px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in-up { animation: slide-in-up 0.5s ease-out forwards; }
          @keyframes fade-in { from {opacity:0;} to {opacity:1;} }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
          @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        `}
      </style>

      <MemoizedProfileDisplay />
      <MemoizedMessage />

      {showEditModal && (
        <MemoizedModal
          title="Edit Profile"
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSubmit}
          saving={saving}
        >
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="relative">
              <AtSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </MemoizedModal>
      )}

      {showPasswordModal && (
        <MemoizedModal
          title="Change Password"
          onClose={() => setShowPasswordModal(false)}
          onSave={handlePasswordSubmit}
          saving={saving}
        >
          <div className="space-y-4">
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </MemoizedModal>
      )}
    </div>
  );
};

export default Profile;
