// ✅ Customer Management Page
import React, { useState } from "react";
import { UserPlus, Users2 } from "lucide-react";
import { FaDownload, FaBell } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ✅ Type for Customer History
type HistoryItem = {
  type: "Credit" | "Debit";
  amount: number;
  date: string;
};

// ✅ Type for Customer
type Customer = {
  id: number;
  name: string;
  phone: string;
  photo: string;
  balance: number;
  history: HistoryItem[];
};

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Rahul Mehta",
      phone: "9876543210",
      photo: "https://i.pravatar.cc/40?img=3",
      balance: 1000,
      history: [
        { type: "Credit", amount: 1500, date: "2025-07-10" },
        { type: "Debit", amount: 500, date: "2025-07-12" },
      ],
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    photo: "",
    balance: "",
  });

  const [search, setSearch] = useState("");

  const handleAddCustomer = () => {
    const id = customers.length + 1;
    if (newCustomer.name && newCustomer.phone) {
      const newEntry: Customer = {
        id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        photo: newCustomer.photo || `https://i.pravatar.cc/40?img=${id}`,
        balance: parseFloat(newCustomer.balance || "0"),
        history: [],
      };
      setCustomers([...customers, newEntry]);
      setNewCustomer({ name: "", phone: "", photo: "", balance: "" });
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

      {/* Add New Customer */}
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
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
          onClick={handleAddCustomer}
        >
          Add Customer
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="border px-4 py-2 rounded w-full"
        placeholder="Search Customer"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* List */}
      <div className="grid gap-4">
        {filtered.map((cust) => (
          <div
            key={cust.id}
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
        ))}
      </div>
    </div>
  );
};

export default CustomerManagement;
