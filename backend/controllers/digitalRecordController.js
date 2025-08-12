import DigitalRecord from '../models/DigitalRecord.js';

/**
 * ✅ Create a new record
 */
export const createRecord = async (req, res) => {
  try {
    const { type, category, amount, date, dueDate, status } = req.body;

    const newRecord = new DigitalRecord({
      type,
      category,
      amount,
      date: date || Date.now(),
      dueDate: type === 'Due' ? dueDate : null,
      status: type === 'Due' ? (status || 'due') : 'paid',
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Failed to create record:', err.message);
    res.status(500).json({ message: 'Failed to create record' });
  }
};

/**
 * ✅ Get all records (latest first)
 */
export const getRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('❌ Failed to fetch records:', err.message);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

/**
 * ✅ Get only due records (without customer populate)
 */
export const getDueRecords = async (req, res) => {
  try {
    const today = new Date();
    const dueRecords = await DigitalRecord.find({
      type: 'Due',
      status: 'due',
      dueDate: { $lte: today },
    })
      .sort({ dueDate: 1 })
      .lean(); // ✅ lean() for performance

    res.json(dueRecords);
  } catch (err) {
    console.error('❌ Error in getDueRecords:', err.message);
    res.status(500).json({ message: 'Failed to fetch due records' });
  }
};

/**
 * ✅ Delete a record by ID
 */
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

/**
 * ✅ Update a record by ID
 */
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DigitalRecord.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update record:', err.message);
    res.status(500).json({ message: 'Failed to update record' });
  }
};
