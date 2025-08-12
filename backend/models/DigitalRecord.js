import mongoose from 'mongoose';

const digitalRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Due'], // record type
    required: true,
  },
  category: {
    type: String, // e.g., Salary, Rent, Grocery
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // record creation date
  },
  dueDate: {
    type: Date, // only for 'Due' type
    default: null,
  },
  status: {
    type: String,
    enum: ['paid', 'due'],
    default: 'paid',
  },
});

// If model already exists, reuse it, else create a new one
const DigitalRecord =
  mongoose.models.DigitalRecord ||
  mongoose.model('DigitalRecord', digitalRecordSchema);

export default DigitalRecord;
