import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Record {
  _id?: string;
  type: string;
  category: string;
  amount: number;
  customer: string;
  date: string;
}

const DigitalRecords: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [newRecord, setNewRecord] = useState<Record>({
    type: '',
    category: '',
    amount: 0,
    customer: '',
    date: ''
  });
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/records');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = async () => {
    const { type, category, amount, customer, date } = newRecord;
    if (!type || !category || !amount || !customer || !date) {
      setError('Please fill all fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/records', newRecord);
      setRecords([...records, response.data]);
      setNewRecord({ type: '', category: '', amount: 0, customer: '', date: '' });
      setError('');
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add record');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Digital Records Report', 20, 10);
    const tableColumn = ['Type', 'Category', 'Amount', 'Customer', 'Date'];
    const tableRows = records.map(record => [
      record.type,
      record.category,
      record.amount.toString(),
      record.customer,
      record.date
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('digital-records.pdf');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Digital Records</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <select
          value={newRecord.type}
          onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Due">Due</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={newRecord.category}
          onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Amount"
          value={newRecord.amount}
          onChange={(e) => setNewRecord({ ...newRecord, amount: parseFloat(e.target.value) })}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Customer"
          value={newRecord.customer}
          onChange={(e) => setNewRecord({ ...newRecord, customer: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={newRecord.date}
          onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleAddRecord}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Record
      </button>

      <button
        onClick={exportPDF}
        className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export PDF
      </button>

      <table className="table-auto w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Customer</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={index} className="text-center">
              <td className="border px-4 py-2">{record.type}</td>
              <td className="border px-4 py-2">{record.category}</td>
              <td className="border px-4 py-2">{record.amount}</td>
              <td className="border px-4 py-2">{record.customer}</td>
              <td className="border px-4 py-2">{record.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DigitalRecords;
