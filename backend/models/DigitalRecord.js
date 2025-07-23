import mongoose from "mongoose";

const digitalRecordSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Income", "Expense", "Due"],
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
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("DigitalRecord", digitalRecordSchema);
