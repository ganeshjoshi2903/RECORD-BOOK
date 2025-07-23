import BusinessReport from '../models/BusinessReport.js';

export const createReport = async (req, res) => {
  try {
    const { type, category, amount, customer, date } = req.body;

    const newReport = new BusinessReport({
      type,
      category,
      amount,
      customer,
      date
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create report' });
  }
};

export const getReports = async (req, res) => {
  try {
    const reports = await BusinessReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

export const getMonthlyReportSummary = async (req, res) => {
  try {
    // Add your monthly summary logic here if needed
    res.status(200).json({ message: 'Monthly summary data (dummy)' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
};
