const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
});

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  photo: String,
  balance: Number,
  history: [historySchema],
});

module.exports = mongoose.model('Customer', customerSchema);
