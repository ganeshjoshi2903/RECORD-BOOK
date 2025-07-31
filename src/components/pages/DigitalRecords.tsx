import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Record {
  _id?: string;
  type: string;
  category: string;
  amount: number;
  customer: string;
  date: string;
}

const DigitalRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [formData, setFormData] = useState<Record>({
    type: "Income",
    category: "",
    amount: 0,
    customer: "",
    date: "",
  });
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/records");
      setRecords(response.data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/records", formData);
      setRecords((prev) => [...prev, response.data]);
      setFormData({ type: "Income", category: "", amount: 0, customer: "", date: "" });
      setError("");
    } catch (err) {
      console.error("Add Record Error", err);
      setError("Failed to add record");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8000/api/records/${id}`);
      setRecords((prev) => prev.filter((rec) => rec._id !== id));
      setError("");
    } catch (err) {
      console.error("Delete Error", err);
      setError("Failed to delete record");
    }
  };

  const exportPDF = () => {
    if (!records.length) {
      alert("No records to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Digital Records Report", 14, 16);
    doc.setFontSize(12);

    const tableColumn = ["Type", "Category", "Amount (₹)", "Customer", "Date"];
    const tableRows = records.map((record) => [
      record.type,
      record.category || "N/A",
      record.amount.toFixed(2),
      record.customer || "N/A",
      new Date(record.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 22,
    });

    doc.save("digital-records.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Digital Records</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <select name="type" value={formData.type} onChange={handleChange} className="border px-2 py-1">
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
          className="border px-2 py-1"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          type="text"
          name="customer"
          placeholder="Customer"
          value={formData.customer}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border px-2 py-1"
        />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-4 mb-4">
        <button onClick={handleAddRecord} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Record
        </button>
        <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="border px-4 py-2">{record.type}</td>
                <td className="border px-4 py-2">{record.category || "—"}</td>
                <td className="border px-4 py-2">₹{record.amount}</td>
                <td className="border px-4 py-2">{record.customer || "—"}</td>
                <td className="border px-4 py-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
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
