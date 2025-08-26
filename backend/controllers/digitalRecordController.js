import DigitalRecord from '../models/DigitalRecord.js';
import Notification from '../models/notification.js';

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

    // 🔔 Immediate notification
    await Notification.create({
      recordId: newRecord._id,   // ✅ linking record to notification
      message:
        type === "Due"
          ? `New Due of ₹${amount} added (Due Date: ${dueDate ? new Date(dueDate).toLocaleDateString() : "Not set"})`
          : `${type} of ₹${amount} added in ${category}`,
      type: type.toLowerCase(),
    });

    // ⏰ Reminder notification (1 day before due date)
    if (type === "Due" && dueDate) {
      const due = new Date(dueDate);
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - 1);

      if (reminderDate > new Date()) {
        await Notification.create({
          recordId: newRecord._id,   // ✅ linking reminder also
          message: `Reminder: Due of ₹${amount} is tomorrow (${due.toLocaleDateString()})`,
          type: "reminder",
        });
      }
    }

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
 * ✅ Get only due records (status = due)
 */
export const getDueRecords = async (req, res) => {
  try {
    const today = new Date();
    const dueRecords = await DigitalRecord.find({
      type: 'Due',
      status: 'due',
      dueDate: { $lte: today },
    }).sort({ dueDate: 1 }).lean();

    res.json(dueRecords);
  } catch (err) {
    console.error('❌ Error in getDueRecords:', err.message);
    res.status(500).json({ message: 'Failed to fetch due records' });
  }
};

/**
 * ✅ Delete record
 */
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DigitalRecord.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // ✅ Delete all notifications linked to this record
    await Notification.deleteMany({ recordId: id });

    res.json({ message: 'Record & related notifications deleted', id });
  } catch (err) {
    console.error('❌ Failed to delete record:', err.message);
    res.status(500).json({ message: 'Failed to delete record' });
  }
};

/**
 * ✅ Update record
 */
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await DigitalRecord.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // ✅ Remove old reminders for this record
    await Notification.deleteMany({ recordId: id, type: 'reminder' });

    // ✅ Add updated reminder
    if (updated.type === 'Due' && updated.dueDate) {
      const due = new Date(updated.dueDate);
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - 1);

      if (reminderDate > new Date()) {
        await Notification.create({
          recordId: updated._id,
          message: `Reminder: Due of ₹${updated.amount} is tomorrow (${due.toLocaleDateString()})`,
          type: 'reminder',
        });
      }
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update record:', err.message);
    res.status(500).json({ message: 'Failed to update record' });
  }
};
