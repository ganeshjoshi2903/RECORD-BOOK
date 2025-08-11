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
  photo?: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
};

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    photo: "",
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

    // Validate required fields
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.balance) {
      setError("Please fill in all required fields.");
      return;
    }

    // Safe duplicate check (avoids .trim() error)
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
      photo: newCustomer.photo.trim(),
      balance: parsedBalance,
    };

    try {
      await axios.post(`${API_URL}/api/customers`, payload);
      setNewCustomer({ name: "", phone: "", photo: "", balance: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer.");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/customers/${id}`);
      fetchCustomers();
    } catch (err: any) {
      console.error(
        "Error deleting customer:",
        err.response?.data || err.message
      );
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const exportStatement = (cust: Customer) => {
    const doc = new jsPDF();
    doc.text(`${cust.name} - Statement`, 10, 10);

    const balance =
      typeof cust.balance === "number" ? cust.balance : 0;

    autoTable(doc, {
      head: [["Name", "Phone", "Balance"]],
      body: [[cust.name, cust.phone, `₹${balance.toFixed(2)}`]],
    });

    doc.save(`${cust.name}_statement.pdf`);
  };

  const filtered = customers.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase())
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
            type="text"
            placeholder="Photo URL (Optional)"
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
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Customer"
        className="border px-4 py-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Customer List */}
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
                {cust.photo && (
                  <img
                    src={cust.photo}
                    alt={cust.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                )}
                <div className="flex flex-col">
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
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1"
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
