import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RecordItem {
  _id?: string;
  type: "Income" | "Expense" | "Due";
  category: string;
  amount: number;
  date: string;
  dueDate?: string;
  customer?: string;
}

// Utility functions
const clampToYMD = (d: Date) => {
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  return dd;
};

const isoYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Format date like "30 Aug 2025"
const formatDisplayDate = (s?: string) => {
  if (!s) return "—";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const DigitalRecords: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [error, setError] = useState<string>("");
  const [daysFilter, setDaysFilter] = useState<number>(1);
  const [formData, setFormData] = useState<RecordItem>({
    type: "Income",
    category: "",
    amount: 0,
    date: isoYMD(new Date()),
    dueDate: "",
    customer: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const today = useMemo(() => clampToYMD(new Date()), []);
  const prevYearStart = useMemo(
    () => clampToYMD(new Date(new Date().getFullYear() - 1, 0, 1)),
    []
  );
  const nextYearToday = useMemo(() => {
    const d = new Date(today);
    d.setFullYear(d.getFullYear() + 1);
    return clampToYMD(d);
  }, [today]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/records`);
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch records");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const parseYMD = (s?: string) => {
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : clampToYMD(d);
  };

  const validateDates = (data: RecordItem): string | null => {
    const d = parseYMD(data.date);
    if (!d) return "Please select a valid Date.";
    if (d < prevYearStart) return "Date cannot be older than previous year.";
    if (d > today) return "Date cannot be in the future.";

    if (data.type === "Due") {
      if (!data.dueDate) return "Due Date is required for Due records.";
      const due = parseYMD(data.dueDate);
      if (!due) return "Please select a valid Due Date.";
      if (due < d) return "Due Date cannot be earlier than the main Date.";
      if (due > nextYearToday) return "Due Date cannot be more than 1 year from today.";
    }
    return null;
  };

  const handleAddRecord = async () => {
    if (!formData.type || !formData.category || !formData.amount || !formData.date) {
      setError("All fields are required.");
      return;
    }
    if (formData.amount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const dateErr = validateDates(formData);
    if (dateErr) {
      setError(dateErr);
      return;
    }

    setError("");
    try {
      const payload = {
        ...formData,
        date: isoYMD(new Date(formData.date)),
        dueDate: formData.dueDate ? isoYMD(new Date(formData.dueDate)) : undefined,
      };
      const res = await axios.post(`${API_URL}/api/records`, payload);
      setRecords((prev) => [...prev, res.data]);
      setFormData({
        type: "Income",
        category: "",
        amount: 0,
        date: isoYMD(today),
        dueDate: "",
        customer: "",
      });
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.message || "Failed to add record.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_URL}/api/records/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      console.error(e);
      setError("Failed to delete record.");
    }
  };

  const getFilteredForDays = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - (daysFilter - 1));
    cutoff.setHours(0, 0, 0, 0);
    return records.filter((r) => {
      const d = parseYMD(r.date);
      return d && d >= cutoff && d <= now;
    });
  };

  // === PDF Export Functions with DueTracker-style format ===
  const handleExportPDF = () => {
    const list = getFilteredForDays();
    const doc = new jsPDF();
    doc.text(`Digital Records - Last ${daysFilter} Day(s)`, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["Type", "Category", "Amount", "Date", "Due Date"]],
      body: list.map((r) => [
        r.type,
        r.category || "—",
        `Rs. ${r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        formatDisplayDate(r.date),
        r.dueDate ? formatDisplayDate(r.dueDate) : "—",
      ]),
      styles: { fontSize: 11 },
      headStyles: { fillColor: [200, 200, 255] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    doc.save(`digital_records_last_${daysFilter}_days.pdf`);
  };

  const handleExportSinglePDF = (record: RecordItem) => {
    const doc = new jsPDF();
    doc.text("Digital Record Details", 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [["Field", "Value"]],
      body: [
        ["Type", record.type],
        ["Category", record.category || "—"],
        ["Amount", `Rs. ${record.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["Date", formatDisplayDate(record.date)],
        ["Due Date", record.dueDate ? formatDisplayDate(record.dueDate) : "—"],
      ],
      styles: { fontSize: 11 },
      headStyles: { fillColor: [200, 200, 255] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    doc.save(`${record.category || "record"}_${record._id || "info"}.pdf`);
  };

  const handleExportSummaryPDF = () => {
    const todayStr = isoYMD(today);
    const todayRecords = records.filter((r) => isoYMD(new Date(r.date)) === todayStr);

    const totalIncome = todayRecords
      .filter((r) => r.type === "Income")
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = todayRecords
      .filter((r) => r.type === "Expense")
      .reduce((sum, r) => sum + r.amount, 0);
    const totalDue = todayRecords
      .filter((r) => r.type === "Due")
      .reduce((sum, r) => sum + r.amount, 0);

    const doc = new jsPDF();
    doc.text("Daily Summary Report", 14, 16);
    doc.text(`Date: ${formatDisplayDate(todayStr)}`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [["Category", "Total"]],
      body: [
        ["Income", `Rs. ${totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["Expense", `Rs. ${totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["Due", `Rs. ${totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        [
          "Net Total",
          `Rs. ${(totalIncome - totalExpense).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
        ],
      ],
      styles: { fontSize: 12 },
      headStyles: { fillColor: [200, 200, 255] },
    });

    doc.save(`daily_summary_${todayStr}.pdf`);
  };

  const dateMin = isoYMD(prevYearStart);
  const dateMax = isoYMD(today);
  const dueMin = formData.date ? formData.date : isoYMD(today);
  const dueMax = isoYMD(nextYearToday);

  return (
    <div className="p-6 min-h-screen bg-[#f5f7fb]">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-700">Digital Records</h2>

      <div className="flex gap-2 mb-6 flex-wrap items-end">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Due">Due</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
          min={1}
          step="1"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border rounded px-3 py-2 shadow-sm"
          min={dateMin}
          max={dateMax}
        />

        {formData.type === "Due" && (
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate || ""}
            onChange={handleChange}
            className="border rounded px-3 py-2 shadow-sm"
            min={dueMin}
            max={dueMax}
          />
        )}

        <button
          onClick={handleAddRecord}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 shadow"
        >
          Add Record
        </button>

        <select
          value={daysFilter}
          onChange={(e) => setDaysFilter(Number(e.target.value))}
          className="border rounded px-3 py-2 shadow-sm"
        >
          <option value={1}>Last 1 Day</option>
          <option value={2}>Last 2 Days</option>
          <option value={3}>Last 3 Days</option>
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>

        <button
          onClick={handleExportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
        >
          Export PDF
        </button>

        <button
          onClick={handleExportSummaryPDF}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 shadow"
        >
          Export Summary PDF
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}

      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Amount</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Due Date</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50 transition">
                <td className="border px-4 py-2">{record.type}</td>
                <td className="border px-4 py-2">{record.category || "—"}</td>
                <td className="border px-4 py-2 text-gray-900 font-medium">
                  Rs. {record.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="border px-4 py-2">{formatDisplayDate(record.date)}</td>
                <td className="border px-4 py-2">{record.dueDate ? formatDisplayDate(record.dueDate) : "—"}</td>
                <td className="border px-4 py-2 flex gap-3">
                  <button
                    onClick={() => handleExportSinglePDF(record)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DigitalRecords;