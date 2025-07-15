import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const dummyData = [
  { customer: "John", revenue: 5000, category: "Sales", month: "July" },
  { customer: "Priya", revenue: 7000, category: "Purchase", month: "July" },
  { customer: "Rahul", revenue: 3000, category: "Sales", month: "June" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const BusinessReports = () => {
  const [monthFilter, setMonthFilter] = useState("All");

  const filtered = monthFilter === "All" ? dummyData : dummyData.filter(r => r.month === monthFilter);

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Customer", "Revenue", "Category", "Month"]],
      body: filtered.map(row => [row.customer, row.revenue, row.category, row.month])
    });
    doc.save("business_report.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Business Reports</h2>
        <div className="flex gap-4">
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="border px-4 py-2 rounded">
            <option value="All">All Months</option>
            <option value="July">July</option>
            <option value="June">June</option>
          </select>
          <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-2">Revenue by Customer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtered}>
              <XAxis dataKey="customer" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-2">Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={filtered} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                {filtered.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h3 className="font-semibold mb-4">Detailed Report Table</h3>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Revenue</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Month</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{row.customer}</td>
                <td className="p-2 border">₹{row.revenue}</td>
                <td className="p-2 border">{row.category}</td>
                <td className="p-2 border">{row.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessReports;
