import mongoose from 'mongoose';

const digitalRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Due'],
    required: true,
  },
  category: String,
  amount: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  date: String,
});

export default mongoose.model('DigitalRecord', digitalRecordSchema);
