// src/components/pages/EditProfile.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          name: res.data.user.name,
          email: res.data.user.email,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/api/profile/update",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Profile updated successfully");
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating profile");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      {message && <p className="text-blue-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
