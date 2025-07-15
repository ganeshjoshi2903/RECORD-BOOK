import React from 'react';

const Notification = () => {
  const notifications = [
    {
      id: 1,
      message: "Payment received from Rahul Traders",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      message: "Reminder: Collect payment from Priya Enterprises",
      time: "Yesterday",
      type: "warning",
    },
    {
      id: 3,
      message: "Your data was backed up successfully",
      time: "2 days ago",
      type: "info",
    },
  ];

  const typeColor = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-teal-600">Notifications</h2>
      {notifications.map((note) => (
        <div
          key={note.id}
          className={`p-4 rounded-md shadow-sm ${typeColor[note.type as keyof typeof typeColor]} border`}
        >
          <p className="font-medium">{note.message}</p>
          <span className="text-sm">{note.time}</span>
        </div>
      ))}
    </div>
  );
};

export default Notification;
