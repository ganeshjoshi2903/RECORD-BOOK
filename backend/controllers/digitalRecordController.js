import DigitalRecord from '../models/DigitalRecord.js';

// Create a new record
export const createRecord = async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;

    const newRecord = new DigitalRecord({
      type,
      category,
      amount,
      date: date || Date.now(),
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Failed to create record:', err.message);
    res.status(500).json({ message: 'Failed to create record' });
  }
};

// Get all records
export const getRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('❌ Failed to fetch records:', err.message);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

// Delete a record by ID
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DigitalRecord.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully', id });
  } catch (err) {
    console.error('❌ Failed to delete record:', err.message);
    res.status(500).json({ message: 'Failed to delete record' });
  }
};
