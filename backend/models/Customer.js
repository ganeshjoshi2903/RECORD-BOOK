import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: String,
  email: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 👇 Fix: Don't overwrite model if already exists
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;
