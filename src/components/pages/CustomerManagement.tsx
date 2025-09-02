import React, { useEffect, useState } from "react";
import { UserPlus, Users2, Trash2 } from "lucide-react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

type Customer = {
  _id: string;
  name: string;
  phone: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
};

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    balance: "",
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/customers`);
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
    setError("");

    if (!newCustomer.name || !newCustomer.phone || !newCustomer.balance) {
      setError("Please fill in all required fields.");
      return;
    }

    const duplicate = customers.find((c) => {
      const existingName = (c.name || "").trim().toLowerCase();
      const existingPhone = (c.phone || "").trim();
      const newName = (newCustomer.name || "").trim().toLowerCase();
      const newPhone = (newCustomer.phone || "").trim();
      return existingName === newName || existingPhone === newPhone;
    });

    if (duplicate) {
      setError("Customer with this name or phone number already exists.");
      return;
    }

    const parsedBalance =
      newCustomer.balance.trim() === "" ? 0 : parseFloat(newCustomer.balance);

    if (isNaN(parsedBalance) || parsedBalance < 0) {
      setError("Please enter a valid non-negative balance.");
      return;
    }

    const payload = {
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      balance: parsedBalance,
    };

    try {
      await axios.post(`${API_URL}/api/customers`, payload);
      setNewCustomer({ name: "", phone: "", balance: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer.");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`${API_URL}/api/customers/${id}`);
      fetchCustomers();
    } catch (err: any) {
      console.error("Error deleting customer:", err.response?.data || err.message);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ✅ Single customer PDF with Rs.
  const exportStatement = (cust: Customer) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${cust.name} - Statement`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Phone", "Balance"]],
      body: [
        [
          cust.name,
          cust.phone,
          `Rs. ${cust.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        ],
      ],
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { halign: "center" },
    });

    doc.save(`${cust.name}_statement.pdf`);
  };

  // ✅ Multi-customer PDF with Rs.
  const exportAllStatements = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("All Customers - Statement", 14, 15);

    const rows = customers.map((cust) => [
      cust.name,
      cust.phone,
      `Rs. ${cust.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Phone", "Balance"]],
      body: rows,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { halign: "center" },
    });

    doc.save("All_Customers_Statements.pdf");
  };

  const filtered = customers.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
        <Users2 className="w-7 h-7" /> Customer Management
      </h2>

      {/* Add Customer */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 border border-gray-200">
        <h3 className="text-lg font-semibold flex gap-2 items-center text-gray-700">
          <UserPlus className="w-5 h-5" /> Add New Customer
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Initial Balance"
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={newCustomer.balance}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, balance: e.target.value })
            }
          />
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow"
          onClick={handleAddCustomer}
        >
          Add Customer
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search Customer"
        className="border px-4 py-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Multi Export Button */}
      {customers.length > 0 && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          onClick={exportAllStatements}
        >
          <FaDownload className="inline mr-2" /> Export All Customers PDF
        </button>
      )}

      {/* Customer List */}
      <div className="grid gap-4">
        {loading ? (
          <p>Loading customers...</p>
        ) : filtered.length > 0 ? (
          filtered.map((cust) => (
            <div
              key={cust._id}
              className="border rounded-xl shadow-md p-5 flex justify-between items-center hover:shadow-lg transition bg-white"
            >
              <div>
                <h4 className="font-semibold text-lg">{cust.name}</h4>
                <p className="text-sm text-gray-600">📞 {cust.phone}</p>
                <p
                  className={`text-sm font-medium ${
                    cust.balance > 0
                      ? "text-green-600"
                      : cust.balance < 0
                      ? "text-red-600"
                      : "text-gray-700"
                  }`}
                >
                  💰 Balance: ₹
                  {cust.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  onClick={() => exportStatement(cust)}
                >
                  <FaDownload className="inline" /> PDF
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                  onClick={() => handleDeleteCustomer(cust._id)}
                >
                  <Trash2 size={16} /> Delete
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
