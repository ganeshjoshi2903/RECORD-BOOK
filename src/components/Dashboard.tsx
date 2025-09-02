import React, { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  IndianRupee,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

// Interfaces
interface Transaction {
  date: string;
  amount: number;
}

interface Due {
  _id: string;
  amount: number;
  dueDate: string;
}

const Dashboard: React.FC = () => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [recentIncome, setRecentIncome] = useState<Transaction[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Transaction[]>([]);
  const [recentDues, setRecentDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [dashboardRes, incomeRes, expenseRes, dueRes] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`, { headers }),
        fetch(`${API_URL}/api/dashboard/income-records`, { headers }),
        fetch(`${API_URL}/api/dashboard/expense-records`, { headers }),
        fetch(`${API_URL}/api/dashboard/due-records`, { headers }),
      ]);

      const dashboardData = await dashboardRes.json();
      const incomeData = await incomeRes.json();
      const expenseData = await expenseRes.json();
      const dueData = await dueRes.json();

      setTotalIncome(dashboardData.totalIncome || 0);
      setTotalExpense(dashboardData.totalExpense || 0);
      setTotalDue(dashboardData.totalDue || 0);
      setRecentIncome(Array.isArray(incomeData) ? incomeData : []);
      setRecentExpenses(Array.isArray(expenseData) ? expenseData : []);
      setRecentDues(Array.isArray(dueData) ? dueData : []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
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

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Income",
            amount: totalIncome,
            icon: <ArrowUpCircle className="text-white w-7 h-7" />,
            bg: "from-green-300 to-green-500",
          },
          {
            title: "Total Expense",
            amount: totalExpense,
            icon: <ArrowDownCircle className="text-white w-7 h-7" />,
            bg: "from-red-300 to-red-500",
          },
          {
            title: "Total Due",
            amount: totalDue,
            icon: <IndianRupee className="text-white w-7 h-7" />,
            bg: "from-yellow-300 to-yellow-500",
          },
          {
            title: "Balance",
            amount: balance,
            icon: <IndianRupee className="text-white w-7 h-7" />,
            bg: "from-blue-300 to-blue-500",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`rounded-2xl p-6 shadow-md bg-gradient-to-r ${item.bg} text-white flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">{item.title}</h4>
              {item.icon}
            </div>
            <div className="mt-4 text-3xl font-bold">₹{item.amount}</div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Overview Chart
        </h2>
        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value}`} />
              <Bar
                dataKey="value"
                fill="url(#colorGradient)"
                radius={[10, 10, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.3} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Recent Income",
            icon: <ArrowUpCircle className="text-green-600" />,
            data: recentIncome,
            badge: "bg-green-100 text-green-700",
            dateKey: "date",
          },
          {
            title: "Recent Expenses",
            icon: <ArrowDownCircle className="text-red-600" />,
            data: recentExpenses,
            badge: "bg-red-100 text-red-700",
            dateKey: "date",
          },
          {
            title: "Recent Dues",
            icon: <CalendarDays className="text-yellow-600" />,
            data: recentDues,
            badge: "bg-yellow-100 text-yellow-700",
            dateKey: "dueDate",
          },
        ].map((section, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-4">
              {section.icon}
              <h3 className="font-semibold text-gray-700">{section.title}</h3>
            </div>
            <ul className="space-y-3">
              {(Array.isArray(section.data) ? section.data.slice(0, 4) : []).map(
                (item: any, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="text-sm text-gray-500">
                      {formatDate(item[section.dateKey])}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${section.badge}`}
                    >
                      ₹{item.amount}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
