import DigitalRecord from "../models/DigitalRecord.js";

export const getRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

export const createRecord = async (req, res) => {
  try {
    const { type, category, amount, customer, date } = req.body;
    if (!type || !category || !amount || !customer || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRecord = new DigitalRecord({ type, category, amount, customer, date });
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Create Error:', error);
    res.status(500).json({ message: "Failed to create record" });
  }
};
