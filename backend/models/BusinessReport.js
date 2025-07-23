import mongoose from 'mongoose';

const businessReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Income', 'Expense', 'Due'],
    required: true,
  },
  category: String,
  amount: Number,
  customer: String,
  date: String,
});

const BusinessReport = mongoose.model('BusinessReport', businessReportSchema);

export default BusinessReport;
