import React, { useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard: React.FC = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Fixed this line
        },
      });

      const data = await res.json();

      setTotalIncome(data.totalIncome || 0);
      setTotalExpense(data.totalExpense || 0);
      setTotalDue(data.totalDue || 0);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const balance = totalIncome - totalExpense;

  const chartData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
    { name: "Due", value: totalDue },
    { name: "Balance", value: balance },
  ];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-green-800">Total Income</h2>
          <div className="text-2xl font-bold flex items-center gap-2 text-green-700">
            <ArrowUpCircle className="w-6 h-6" /> ₹{totalIncome}
          </div>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-red-800">Total Expense</h2>
          <div className="text-2xl font-bold flex items-center gap-2 text-red-700">
            <ArrowDownCircle className="w-6 h-6" /> ₹{totalExpense}
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-yellow-800">Total Due</h2>
          <div className="text-2xl font-bold text-yellow-700">₹{totalDue}</div>
        </div>

        <div className="bg-blue-100 p-4 rounded-xl">
          <h2 className="text-lg font-semibold text-blue-800">Balance</h2>
          <div className="text-2xl font-bold text-blue-700">₹{balance}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
