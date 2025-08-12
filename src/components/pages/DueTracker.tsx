import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DueRecord {
  _id: string;
  amount: number;
  dueDate: string;
}

const DueTracker = () => {
  const [dueRecords, setDueRecords] = useState<DueRecord[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDueRecords();
  }, []);

  const fetchDueRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/due-records`);
      setDueRecords(res.data);
    } catch (err) {
      console.error("Error fetching due records:", err);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/records/${id}`);
      setDueRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const generatePDF = (record: DueRecord) => {
    const doc = new jsPDF();
    doc.text("Due Record Details", 14, 16);

    autoTable(doc, {
      head: [["Amount", "Due Date"]],
      body: [[`₹${record.amount}`, record.dueDate || "N/A"]],
      startY: 20,
    });

    doc.save(`DueRecord-${record._id}.pdf`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📌 Due Tracker</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Due Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dueRecords.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No due records found
                </td>
              </tr>
            ) : (
              dueRecords.map((record, index) => (
                <tr key={record._id} className="border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">₹{record.amount}</td>
                  <td className="px-4 py-2 border">{record.dueDate || "N/A"}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => deleteRecord(record._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => generatePDF(record)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DueTracker;
