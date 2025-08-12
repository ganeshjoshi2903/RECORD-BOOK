import mongoose from 'mongoose';

const digitalRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Due'], // record ka type
    required: true,
  },
  category: {
    type: String, // jaise Salary, Rent, Grocery
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // record create date
  },
});

// Agar model already exist kare to usko reuse karo, nahi to naya banao
const DigitalRecord =
  mongoose.models.DigitalRecord ||
  mongoose.model('DigitalRecord', digitalRecordSchema);

export default DigitalRecord;
