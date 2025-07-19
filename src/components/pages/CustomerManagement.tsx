import React, { useEffect, useState } from "react";
import { UserPlus, Users2 } from "lucide-react";
import { FaDownload, FaBell } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

type HistoryItem = {
  type: "Credit" | "Debit";
  amount: number;
  date: string;
};

type Customer = {
  _id: string;
  name: string;
  phone: string;
  photo: string;
  balance: number;
  history: HistoryItem[];
};

// ✅ Your backend base URL here
const BACKEND_URL = "http://localhost:8000";

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    photo: "",
    balance: "",
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/customers`);
      console.log("Customers fetched:", res.data);
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Add a new customer
  const handleAddCustomer = async () => {
    if (newCustomer.name && newCustomer.phone) {
      const payload = {
        name: newCustomer.name,
        phone: newCustomer.phone,
        photo:
          newCustomer.photo ||
          `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
        balance: parseFloat(newCustomer.balance) || 0,
        history: [],
      };

      try {
        await axios.post(`${BACKEND_URL}/api/customers`, payload);
        setNewCustomer({ name: "", phone: "", photo: "", balance: "" });
        fetchCustomers(); // refresh list
      } catch (err) {
        console.error("Error adding customer:", err);
      }
    }
  };

  // ✅ Export individual statement to PDF
  const exportStatement = (cust: Customer) => {
    const doc = new jsPDF();
    doc.text(`${cust.name} - Statement`, 10, 10);
    autoTable(doc, {
      head: [["Date", "Type", "Amount"]],
      body: cust.history.map((h) => [h.date, h.type, h.amount.toString()]),
    });
    doc.save(`${cust.name}_statement.pdf`);
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <Users2 className="w-6 h-6" /> Customer Management
      </h2>

      {/* ✅ Add Customer Form */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h3 className="text-lg font-semibold flex gap-2 items-center">
          <UserPlus className="w-5 h-5" /> Add New Customer
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border px-3 py-2 rounded"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="border px-3 py-2 rounded"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
          <input
            type="url"
            placeholder="Photo URL"
            className="border px-3 py-2 rounded"
            value={newCustomer.photo}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, photo: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Initial Balance"
            className="border px-3 py-2 rounded"
            value={newCustomer.balance}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, balance: e.target.value })
            }
          />
        </div>
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
          onClick={handleAddCustomer}
        >
          Add Customer
        </button>
      </div>

      {/* ✅ Search */}
      <input
        type="text"
        placeholder="Search Customer"
        className="border px-4 py-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ✅ Customer List */}
      <div className="grid gap-4">
        {loading ? (
          <p>Loading customers...</p>
        ) : filtered.length > 0 ? (
          filtered.map((cust) => (
            <div
              key={cust._id}
              className="border rounded shadow p-4 flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={cust.photo}
                  alt={cust.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{cust.name}</h4>
                  <p className="text-sm text-gray-600">📞 {cust.phone}</p>
                  <p className="text-sm">💰 Balance: ₹{cust.balance}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => exportStatement(cust)}
                >
                  <FaDownload className="inline mr-1" /> PDF
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  <FaBell className="inline mr-1" /> Reminder
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
