import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DueRecord {
  _id: string;
  amount: number;
  dueDate?: string;
  status: "paid" | "due";
}

const DueTracker: React.FC = () => {
  const [dueRecords, setDueRecords] = useState<DueRecord[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all Due records including paid/unpaid
  useEffect(() => {
    fetchDueRecords();
  }, []);

  const fetchDueRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/due-records`);
      setDueRecords(res.data); // backend now sends all "Due" records
    } catch (err) {
      console.error("Error fetching due records:", err);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/records/${id}`);
      setDueRecords(prev => prev.filter(record => record._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const toggleStatusOnBackend = async (id: string, currentStatus: "paid" | "due") => {
    try {
      const newStatus = currentStatus === "paid" ? "due" : "paid";

      // Optimistic UI update
      setDueRecords(prev =>
        prev.map(record => record._id === id ? { ...record, status: newStatus } : record)
      );

      // Send update to backend
      await axios.put(`${API_URL}/api/records/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert if failed
      setDueRecords(prev =>
        prev.map(record => record._id === id ? { ...record, status: currentStatus } : record)
      );
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("📌 Due Records Report", 14, 16);

    autoTable(doc, {
      head: [["#", "Amount", "Due Date", "Status"]],
      body: dueRecords.map((record, index) => [
        index + 1,
        `Rs. ${record.amount}`,
        formatDate(record.dueDate),
        record.status === "paid" ? "Paid" : "Unpaid",
      ]),
      startY: 20,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [100, 181, 246] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    doc.save(`DueRecords.pdf`);
  };

  const totalDue = dueRecords.reduce((sum, rec) => sum + rec.amount, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        📌 Due Tracker
      </h2>

      <div className="max-w-md mx-auto mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium text-lg">Total Due:</span>
          <span className="text-red-500 font-bold text-xl">Rs. {totalDue}</span>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dueRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No due records found
                </td>
              </tr>
            ) : (
              dueRecords.map((record, index) => (
                <tr key={record._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{index + 1}</td>
                  <td className={`px-6 py-4 whitespace-nowrap font-medium ${record.status === "paid" ? "text-green-500" : "text-red-500"}`}>
                    Rs. {record.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(record.dueDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatusOnBackend(record._id, record.status)}
                      className={`px-3 py-1 rounded text-white ${record.status === "paid" ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}`}
                    >
                      {record.status === "paid" ? "Paid" : "Unpaid"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() => deleteRecord(record._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Export All Records to PDF
        </button>
      </div>
    </div>
  );
};

export default DueTracker;
