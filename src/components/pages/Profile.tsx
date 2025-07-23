import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  // Static user data — replace later with real user info from auth
  const user = {
    name: "User",
    email: "user@gmail.com",
    phone: "+91 93593 62054",
    businessName: "User Traders",
    joined: "March 2024",
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT or auth token
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-6 space-y-6 relative">
      <h2 className="text-3xl font-bold text-teal-700 mb-2">User Profile</h2>
      
      <div className="space-y-3 text-gray-800">
        <div>
          <span className="font-semibold text-gray-600">Name:</span>
          <p>{user.name}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Email:</span>
          <p>{user.email}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Phone:</span>
          <p>{user.phone}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Business Name:</span>
          <p>{user.businessName}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-600">Joined:</span>
          <p>{user.joined}</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
