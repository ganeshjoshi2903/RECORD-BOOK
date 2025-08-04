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

// Interfaces
interface Transaction {
  date: string;
  amount: number;
}

// interface Due extends Transaction {
//   dateDue?: string;
// }
interface Due {
  _id: string;
  customer: {
    name: string;
  };
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
      setRecentIncome(incomeData || []);
      setRecentExpenses(expenseData || []);
      setRecentDues(dueData || []);
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
    <div className="p-6 space-y-10 bg-gradient-to-b from-gray-100 to-white min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            title: "Total Income",
            amount: totalIncome,
            icon: <ArrowUpCircle className="text-green-600 w-5 h-5" />,
            bg: "bg-green-50 text-green-800",
          },
          {
            title: "Total Expense",
            amount: totalExpense,
            icon: <ArrowDownCircle className="text-red-600 w-5 h-5" />,
            bg: "bg-red-50 text-red-800",
          },
          {
            title: "Total Due",
            amount: totalDue,
            icon: <IndianRupee className="text-yellow-600 w-5 h-5" />,
            bg: "bg-yellow-50 text-yellow-800",
          },
          {
            title: "Balance",
            amount: balance,
            icon: <IndianRupee className="text-blue-600 w-5 h-5" />,
            bg: "bg-blue-50 text-blue-800",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition ${item.bg}`}
          >
            <h4 className="text-sm font-medium">{item.title}</h4>
            <div className="mt-2 text-2xl font-bold flex items-center gap-2">
              {item.icon} ₹{item.amount}
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Overview Chart
        </h2>
        <div className="w-full h-[300px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₹${value}`} />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
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
            header: "bg-green-100",
            alt: "bg-green-50",
            color: "text-green-800",
          },
          {
            title: "Recent Expenses",
            icon: <ArrowDownCircle className="text-red-600" />,
            data: recentExpenses,
            header: "bg-red-100",
            alt: "bg-red-50",
            color: "text-red-800",
          },
          {
            title: "Recent Dues",
            icon: <CalendarDays className="text-yellow-600" />,
            data: recentDues,
            header: "bg-yellow-100",
            alt: "bg-yellow-50",
            color: "text-yellow-800",
          },
        ].map((section, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h3 className={`font-semibold text-md ${section.color}`}>
                {section.title}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl">
                <thead className={`${section.header} ${section.color}`}>
                  <tr>
                    {section.title === "Recent Dues" ? (
                      <>
                        <th className="text-left px-3 py-2">Customer</th>
                        <th className="text-left px-3 py-2">Due Date</th>
                      </>
                    ) : (
                      <th className="text-left px-3 py-2">Date</th>
                    )}
                    <th className="text-left px-3 py-2">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {section.data.slice(0, 4).map((item: any, i) => (
                    <tr
                      key={i}
                      className={`${i % 2 === 0 ? "bg-white" : section.alt
                        } hover:bg-gray-50`}
                    >
                      {section.title === "Recent Dues" ? (
                        <>
                          <td className="px-3 py-2">{item.customer?.name || "N/A"}</td>
                          <td className="px-3 py-2">{formatDate(item.dueDate)}</td>
                        </>
                      ) : (
                        <td className="px-3 py-2">{formatDate(item.date)}</td>
                      )}
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
