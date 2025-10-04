// src/components/pages/ResetPassword.tsx
import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "../../api/axiosConfig";

// ----- Memoized Alert Message -----
const AlertMessage = React.memo(
  ({ message, type }: { message: string; type: "error" | "success" }) => {
    return (
      <p
        className={`text-center text-sm ${type === "success" ? "text-green-600" : "text-red-500"}`}
      >
        {message}
      </p>
    );
  }
);

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ----- Submit Handler -----
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setMessage("");
      setLoading(true);

      try {
        const res = await api.post(`/api/auth/reset-password/${token}`, { newPassword });
        setMessage(res.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    },
    [newPassword, navigate, token]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Alert Message */}
          {(message || error) && (
            <AlertMessage message={message || error} type={message ? "success" : "error"} />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <p
          className="mt-5 text-center text-sm text-gray-500 cursor-pointer hover:underline flex items-center justify-center gap-1"
          onClick={() => navigate("/login")}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to Login
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
