import mongoose from 'mongoose';

const digitalRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Due'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


const DigitalRecord = mongoose.models.DigitalRecord || mongoose.model('DigitalRecord', digitalRecordSchema);

export default DigitalRecord;