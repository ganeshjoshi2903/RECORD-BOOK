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
  date: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["paid", "due"],
    default: "paid",
  },
});

const DigitalRecord =
  mongoose.models.DigitalRecord ||
  mongoose.model("DigitalRecord", digitalRecordSchema);

export default DigitalRecord;
