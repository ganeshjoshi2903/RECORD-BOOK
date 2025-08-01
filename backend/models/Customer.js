
import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },           
  balance: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customer', customerSchema);