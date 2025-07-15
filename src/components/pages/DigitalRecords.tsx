import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaPlus, FaCalculator } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DigitalRecords = () => {
  const [records, setRecords] = useState([
    { id: 1, type: "Income", category: "Sales", amount: 5000, customer: "John", date: "2025-07-10" },
    { id: 2, type: "Expense", category: "Purchase", amount: 1500, customer: "Vendor A", date: "2025-07-11" },
  ]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showCalculator, setShowCalculator] = useState(false);

  const [newRecord, setNewRecord] = useState({
    type: "Income",
    category: "",
    amount: "",
    customer: "",
    date: ""
  });

  const handleAddRecord = () => {
    if (newRecord.category && newRecord.amount && newRecord.customer && newRecord.date) {
      const id = records.length + 1;
      setRecords([...records, { ...newRecord, id, amount: parseFloat(newRecord.amount) }]);
      setNewRecord({ type: "Income", category: "", amount: "", customer: "", date: "" });
    }
  };

  const getSummary = () => {
    let income = 0, expense = 0;
    records.forEach(r => {
      if (r.type === "Income") income += r.amount;
      if (r.type === "Expense") expense += r.amount;
    });
    return { income, expense, balance: income - expense };
  };

  const filteredRecords = records.filter(r => {
    const matchType = filter === "All" || r.type === filter;
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      !dateRange.from ||
      !dateRange.to ||
      (new Date(r.date) >= new Date(dateRange.from) && new Date(r.date) <= new Date(dateRange.to));
    return matchType && matchSearch && matchDate;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Date", "Type", "Category", "Amount", "Customer"]],
      body: filteredRecords.map(r => [r.date, r.type, r.category, r.amount, r.customer]),
    });
    doc.save("records.pdf");
  };

  const summary = getSummary();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Digital Records</h2>
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
            <FaDownload className="mr-1" /> Export PDF
          </button>
          <button onClick={handleAddRecord} className="px-4 py-2 border border-gray-400 rounded flex items-center">
            <FaPlus className="mr-1" /> Add Record
          </button>
          <button onClick={() => setShowCalculator(!showCalculator)} className="px-4 py-2 border border-gray-400 rounded flex items-center">
            <FaCalculator className="mr-1" /> Calculator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <select className="border px-3 py-2 rounded" value={newRecord.type} onChange={e => setNewRecord({ ...newRecord, type: e.target.value })}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Due">Due</option>
        </select>
        <input type="text" placeholder="Category" className="border px-3 py-2 rounded" value={newRecord.category} onChange={e => setNewRecord({ ...newRecord, category: e.target.value })} />
        <input type="number" placeholder="Amount" className="border px-3 py-2 rounded" value={newRecord.amount} onChange={e => setNewRecord({ ...newRecord, amount: e.target.value })} />
        <input type="text" placeholder="Customer" className="border px-3 py-2 rounded" value={newRecord.customer} onChange={e => setNewRecord({ ...newRecord, customer: e.target.value })} />
        <input type="date" className="border px-3 py-2 rounded" value={newRecord.date} onChange={e => setNewRecord({ ...newRecord, date: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Due">Due</option>
        </select>
        <input
          type="date"
          className="border px-3 py-2 rounded"
          onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">Total Income: ₹{summary.income}</div>
        <div className="bg-red-100 p-4 rounded shadow">Total Expense: ₹{summary.expense}</div>
        <div className="bg-blue-100 p-4 rounded shadow">Balance: ₹{summary.balance}</div>
      </div>

      <div className="grid gap-4">
        {filteredRecords.map(r => (
          <div key={r.id} className="p-4 border rounded shadow flex justify-between">
            <div>
              <h3 className="font-semibold">{r.customer} - {r.category}</h3>
              <p className="text-sm text-gray-500">{r.date}</p>
            </div>
            <div className={`font-bold ${r.type === "Income" ? "text-green-600" : "text-red-600"}`}>₹{r.amount}</div>
          </div>
        ))}
        {filteredRecords.length === 0 && <p className="text-center text-gray-400">No records found</p>}
      </div>

      {showCalculator && (
        <div className="bg-white border p-4 rounded shadow">
          <h4 className="font-bold mb-2">Simple Calculator</h4>
          <iframe
            title="Calculator"
            src="https://www.desmos.com/scientific"
            width="100%"
            height="400"
            className="rounded border"
          />
        </div>
      )}
    </motion.div>
  );
};

export default DigitalRecords;