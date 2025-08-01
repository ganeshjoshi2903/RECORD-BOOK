import DigitalRecord from '../models/digitalRecord.js';
import Customer from '../models/Customer.js';

export const createRecord = async (req, res) => {
  try {
    const { type, category, amount, customer, date } = req.body;

    let customerDoc = await Customer.findOne({ name: customer });
    if (!customerDoc) {
      customerDoc = new Customer({ name: customer, balance: 0 });
      await customerDoc.save();
    }

    const newRecord = new DigitalRecord({
      type,
      category,
      amount,
      customer: customerDoc._id,
      date,
    });

    await newRecord.save();
    res.status(201).json({ ...newRecord._doc, customer: customerDoc.name });
  } catch (err) {
    console.error('❌ Failed to create record:', err.message);
    res.status(500).json({ message: 'Failed to create record' });
  }
};

export const getRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().populate('customer', 'name');
    const enriched = records.map(r => ({
      ...r._doc,
      customer: r.customer?.name || 'Unknown'
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch records' });
  }
};

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