const BusinessReport = require('../models/BusinessReport');

exports.createReport = async (req, res) => {
  try {
    const report = new BusinessReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await BusinessReport.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
