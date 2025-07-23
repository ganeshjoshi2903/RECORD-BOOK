const Record = require('../models/recordModel');

exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const records = await Record.find({ userId });

    const income = records.filter(r => r.type === 'Income');
    const expense = records.filter(r => r.type === 'Expense');

    const totalIncome = income.reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = expense.reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i).toLocaleString('default', { month: 'short' });

      const monthlyIncome = income
        .filter(r => new Date(r.date).getMonth() === i)
        .reduce((sum, r) => sum + r.amount, 0);

      const monthlyExpense = expense
        .filter(r => new Date(r.date).getMonth() === i)
        .reduce((sum, r) => sum + r.amount, 0);

      return {
        month,
        income: monthlyIncome,
        expense: monthlyExpense
      };
    });

    const recentTransactions = records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      totalIncome,
      totalExpense,
      balance,
      chartData,
      recentTransactions
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
