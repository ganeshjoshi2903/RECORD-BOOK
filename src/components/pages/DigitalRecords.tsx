import React, { useEffect, useState } from "react";
import axios from "axios";

interface Record {
  _id?: string;
  type: string;
  category: string;
  amount: number;
  date: string;
}

const DigitalRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [formData, setFormData] = useState<Record>({
    type: "Income",
    category: "",
    amount: 0,
    date: "",
  });
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/records`);
      setRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async () => {
    if (!formData.type || !formData.category || !formData.amount || !formData.date) {
      setError("All fields are required");
      return;
    }

    // ✅ Duplicate category check (case-insensitive)
    const categoryExists = records.some(
      (rec) => rec.category.trim().toLowerCase() === formData.category.trim().toLowerCase()
    );

    if (categoryExists) {
      setError(`Category "${formData.category}" already exists`);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/records`, formData);
      setRecords((prev) => [...prev, response.data]);
      setFormData({ type: "Income", category: "", amount: 0, date: "" });
      setError("");
    } catch (err) {
      console.error("Add Record Error", err);
      setError("Failed to add record");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/api/records/${id}`);
      setRecords((prev) => prev.filter((rec) => rec._id !== id));
      setError("");
    } catch (err) {
      console.error("Delete Error", err);
      setError("Failed to delete record");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fb]">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
        Digital Records
      </h2>

      {/* Add Record Form */}
      <div className="flex gap-2 mb-6 flex-wrap items-end">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Due">Due</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        />
        <button
          onClick={handleAddRecord}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
        >
          Add Record
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Records Table */}
      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50 transition">
                <td className="border px-4 py-2">{record.type}</td>
                <td className="border px-4 py-2">{record.category || "—"}</td>
                <td className="border px-4 py-2">₹{record.amount}</td>
                <td className="border px-4 py-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DigitalRecords;
