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

interface Transaction {
  date: string;
  amount: number;
}

interface Due {
  date: string;
  amount: number;
  dateDue?: string;
}

const Dashboard: React.FC = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [recentIncome, setRecentIncome] = useState<Transaction[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Transaction[]>([]);
  const [recentDues, setRecentDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setTotalIncome(data.totalIncome || 0);
      setTotalExpense(data.totalExpense || 0);
      setTotalDue(data.totalDue || 0);

      const [incomeRes, expenseRes, dueRes] = await Promise.all([
        fetch("http://localhost:8000/api/dashboard/income-records", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/dashboard/expense-records", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/dashboard/due-records", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [incomeData, expenseData, dueData] = await Promise.all([
        incomeRes.json(),
        expenseRes.json(),
        dueRes.json(),
      ]);

      setRecentIncome(incomeData);
      setRecentExpenses(expenseData);
      setRecentDues(dueData);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-lg font-medium">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-6 space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Total Income",
            icon: <ArrowUpCircle className="w-5 h-5 text-green-600" />,
            amount: totalIncome,
            bg: "bg-green-50 text-green-800",
          },
          {
            label: "Total Expense",
            icon: <ArrowDownCircle className="w-5 h-5 text-red-600" />,
            amount: totalExpense,
            bg: "bg-red-50 text-red-800",
          },
          {
            label: "Total Due",
            icon: <IndianRupee className="w-5 h-5 text-yellow-600" />,
            amount: totalDue,
            bg: "bg-yellow-50 text-yellow-800",
          },
          {
            label: "Balance",
            icon: <IndianRupee className="w-5 h-5 text-blue-600" />,
            amount: balance,
            bg: "bg-blue-50 text-blue-800",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition ${card.bg}`}
          >
            <h3 className="text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold mt-2 flex items-center gap-2">
              {card.icon} ₹{card.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Overview Chart
        </h2>
        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barSize={80}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value}`} />
              <Bar dataKey="value" fill="#60a5fa" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Recent Income",
            icon: <IndianRupee className="text-green-600" />,
            data: recentIncome,
            headerBg: "bg-green-100",
            rowAlt: "bg-green-50",
            textColor: "text-green-900",
          },
          {
            title: "Recent Expenses",
            icon: <ArrowDownCircle className="text-red-600" />,
            data: recentExpenses,
            headerBg: "bg-red-100",
            rowAlt: "bg-red-50",
            textColor: "text-red-900",
          },
          {
            title: "Recent Dues",
            icon: <CalendarDays className="text-yellow-600" />,
            data: recentDues.map((d) => ({
              ...d,
              date: d.dateDue || d.date,
            })),
            headerBg: "bg-yellow-100",
            rowAlt: "bg-yellow-50",
            textColor: "text-yellow-900",
          },
        ].map((section, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h3 className={`text-md font-semibold ${section.textColor}`}>
                {section.title}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead className={`${section.headerBg} ${section.textColor}`}>
                  <tr>
                    <th className="text-left px-3 py-2">Date</th>
                    <th className="text-left px-3 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {section.data.slice(0, 4).map((item: any, i: number) => (
                    <tr
                      key={i}
                      className={`${
                        i % 2 === 0 ? "bg-white" : section.rowAlt
                      } hover:bg-gray-50 transition-all`}
                    >
                      <td className="px-3 py-2">{formatDate(item.date)}</td>
                      <td className="px-3 py-2 font-medium">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
