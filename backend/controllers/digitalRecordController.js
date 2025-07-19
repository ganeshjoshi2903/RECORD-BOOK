const DigitalRecord = require('../models/DigitalRecord');

const createRecord = async (req, res) => {
  try {
    const newRecord = new DigitalRecord(req.body);
    const saved = await newRecord.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ message: 'Failed to create record' });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

module.exports = { createRecord, getAllRecords };
