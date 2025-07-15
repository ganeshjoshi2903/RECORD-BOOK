import React from 'react';

const Profile = () => {
  const user = {
    name: "User",
    email: "user@gmail.com",
    phone: "+91 93593 62054",
    businessName: "User Traders",
    joined: "March 2024",
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-teal-600">User Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-medium text-gray-600">User Name:</span>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">User Email:</span>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">User Phone Number:</span>
          <p className="text-gray-800">{user.phone}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">User Business Name:</span>
          <p className="text-gray-800">{user.businessName}</p>
        </div>
        <div>
          <span className="font-medium text-gray-600">User Since:</span>
          <p className="text-gray-800">{user.joined}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
