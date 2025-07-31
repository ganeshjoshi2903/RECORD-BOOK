import DigitalRecord from '../models/digitalRecord.js';
import Customer from '../models/Customer.js';

export const getDashboardStats = async (req, res) => {
  try {
    const income = await DigitalRecord.find({ type: 'Income' });
    const expense = await DigitalRecord.find({ type: 'Expense' });
    const due = await DigitalRecord.find({ type: 'Due' });

    res.json({
      totalIncome: income.reduce((acc, curr) => acc + curr.amount, 0),
      totalExpense: expense.reduce((acc, curr) => acc + curr.amount, 0),
      totalDue: due.reduce((acc, curr) => acc + curr.amount, 0),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getIncomeRecords = async (req, res) => {
  const records = await DigitalRecord.find({ type: 'Income' });
  res.json(records);
};

export const getExpenseRecords = async (req, res) => {
  const records = await DigitalRecord.find({ type: 'Expense' });
  res.json(records);
};

export const getDueRecords = async (req, res) => {
  try {
    const dueRecords = await DigitalRecord.find({ type: 'Due' }).populate('customer', 'name');

    const enriched = dueRecords.map((r) => ({
      _id: r._id,
      customer: {
        name: r.customer?.name || 'N/A',
      },
      amount: r.amount || 0,
      dueDate: r.date || 'N/A',
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Error in getDueRecords:", err.message);
    res.status(500).json({ message: 'Failed to fetch due records' });
  }
};
