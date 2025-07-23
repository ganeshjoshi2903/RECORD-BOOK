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
