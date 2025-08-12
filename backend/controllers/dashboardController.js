import DigitalRecord from '../models/DigitalRecord.js';

// 📊 Dashboard total stats
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

// 💰 Income records
export const getIncomeRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find({ type: 'Income' }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch income records' });
  }
};

// 💸 Expense records
export const getExpenseRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find({ type: 'Expense' }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expense records' });
  }
};

// 📅 Due records (without customer)
export const getDueRecords = async (req, res) => {
  try {
    const dueRecords = await DigitalRecord.find({ type: 'Due' }).sort({ date: 1 });

    // Directly send due records without customer info
    const enriched = dueRecords.map(r => ({
      _id: r._id,
      amount: r.amount || 0,
      dueDate: r.date || 'N/A',
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Error in getDueRecords:", err.message);
    res.status(500).json({ message: 'Failed to fetch due records' });
  }
};
