import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  Edit,
  Save,
  AlertCircle,
  Info,
  X,
  Loader2,
} from "lucide-react";

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

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState<PasswordData>({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

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
  }, []); // run once on mount

  const handleEditSubmit = async () => {
    try {
      setSaving(true);
      const res = await axios.put("http://localhost:8000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setShowEditModal(false);
      setMessage({ type: "success", text: "✅ Profile updated successfully!" });
    } catch {
      setMessage({ type: "error", text: "❌ Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      setSaving(true);
      await axios.put("http://localhost:8000/api/profile/password", passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordModal(false);
      setMessage({ type: "success", text: "✅ Password updated!" });
    } catch {
      setMessage({ type: "error", text: "❌ Error updating password." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-red-500">
        <AlertCircle className="mr-2" /> Profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f6ff] to-[#eef1fa] py-14 px-4">
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-3xl font-bold flex justify-center items-center shadow-lg ring-4 ring-indigo-300">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{profile.name}</h2>
              <p className="text-gray-500 flex items-center gap-1">
                <Mail size={16} /> {profile.email}
              </p>
              {profile.createdAt && (
                <p className="text-sm text-gray-400">
                  Joined: {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm transition"
            >
              <Lock size={16} /> Password
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <Info size={14} className="inline mr-1 text-indigo-500" />
            <strong>User ID:</strong> <code className="text-gray-800">{profile._id}</code>
          </p>
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-md text-sm flex items-center gap-2 z-50 ${
          message.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {message.type === "success" ? <Save size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {showEditModal && (
        <Modal
          title="Edit Profile"
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSubmit}
          saving={saving}
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Name"
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
        </Modal>
      )}

      {showPasswordModal && (
        <Modal
          title="Change Password"
          onClose={() => setShowPasswordModal(false)}
          onSave={handlePasswordSubmit}
          saving={saving}
        >
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            className="w-full border p-2 rounded mb-3"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </Modal>
      )}
    </div>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onSave, saving, children }) => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <X size={20} className="cursor-pointer text-gray-500" onClick={onClose} />
      </div>
      {children}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
          disabled={saving}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
        </button>
      </div>
    </div>
  </div>
);

export default Profile;
