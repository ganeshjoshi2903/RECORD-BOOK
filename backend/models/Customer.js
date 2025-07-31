import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  photo: String,
  balance: Number,
  history: [
    {
      type: { type: String, enum: ['Credit', 'Debit'] },
      amount: Number,
      date: String,
    },
  ],
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;