import DigitalRecord from "../models/DigitalRecord.js";

export const getDashboardData = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalDue = 0;

    records.forEach((rec) => {
      const amt = Number(rec.amount);
      if (rec.type === "Income") totalIncome += amt;
      else if (rec.type === "Expense") totalExpense += amt;
      else if (rec.type === "Due") totalDue += amt;
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      totalDue,
      records,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};

// 👇 NEW: For Income Table
export const getIncomeRecords = async (req, res) => {
  try {
    const incomeRecords = await DigitalRecord.find({ type: "Income" }).sort({ date: -1 });
    res.status(200).json(incomeRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch income records" });
  }
};

// 👇 NEW: For Expense Table
export const getExpenseRecords = async (req, res) => {
  try {
    const expenseRecords = await DigitalRecord.find({ type: "Expense" }).sort({ date: -1 });
    res.status(200).json(expenseRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expense records" });
  }
};

// 👇 NEW: For Due Table
export const getDueRecords = async (req, res) => {
  try {
    const dueRecords = await DigitalRecord.find({ type: "Due" }).sort({ date: -1 });
    res.status(200).json(dueRecords);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch due records" });
  }
};
