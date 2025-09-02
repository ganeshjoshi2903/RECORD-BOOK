import DigitalRecord from '../models/DigitalRecord.js';

// 📊 Dashboard total stats (aggregation fix)
export const getDashboardStats = async (req, res) => {
  try {
    // Income total
    const incomeAgg = await DigitalRecord.aggregate([
      { $match: { type: 'Income' } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);

    // Expense total
    const expenseAgg = await DigitalRecord.aggregate([
      { $match: { type: 'Expense' } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);

    // Due total
    const dueAgg = await DigitalRecord.aggregate([
      { $match: { type: 'Due' } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);

    res.json({
      totalIncome: incomeAgg[0]?.total || 0,
      totalExpense: expenseAgg[0]?.total || 0,
      totalDue: dueAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// 💰 Income records
export const getIncomeRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find({ type: 'Income' })
      .sort({ date: -1 })
      .lean(); // lean() returns plain JS objects
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch income records' });
  }
};

// 💸 Expense records
export const getExpenseRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find({ type: 'Expense' })
      .sort({ date: -1 })
      .lean();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expense records' });
  }
};

// 📅 Due records (without customer)
export const getDueRecords = async (req, res) => {
  try {
    const dueRecords = await DigitalRecord.find({ type: 'Due' })
      .sort({ date: 1 })
      .lean();

    const enriched = dueRecords.map(r => ({
      _id: r._id,
      amount: Number(r.amount) || 0, // ensure number
      dueDate: r.date || 'N/A',
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Error in getDueRecords:", err.message);
    res.status(500).json({ message: 'Failed to fetch due records' });
  }
};
