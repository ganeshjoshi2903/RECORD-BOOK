import React, { useEffect, useState } from "react";
import { UserPlus, Users2 } from "lucide-react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_REACT_APP_API_URL;

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
        fetchCustomers();
      } catch (err) {
        console.error("Error adding customer:", err);
      }
    }
  };

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
            type="text"
            placeholder="Phone Number"
            className="border px-3 py-2 rounded"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Photo URL (optional)"
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
          onClick={handleAddCustomer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Customer
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search Customer"
          className="border px-3 py-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading customers...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No customers found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((cust) => (
            <div
              key={cust._id}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={cust.photo}
                  alt={cust.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{cust.name}</h4>
                  <p className="text-sm text-gray-500">{cust.phone}</p>
                </div>
              </div>
              <p className="mt-2 font-medium">
                Balance: ₹{cust.balance.toFixed(2)}
              </p>
              <button
                onClick={() => exportStatement(cust)}
                className="mt-2 text-blue-600 flex items-center gap-2 hover:underline"
              >
                <FaDownload /> Download Statement
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
