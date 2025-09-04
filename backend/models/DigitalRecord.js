import mongoose from "mongoose";

const digitalRecordSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Income", "Expense", "Due"], // restrict to only these 3
      required: [true, "Record type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"],
    },
    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          const currentYear = new Date().getFullYear();
          const recordYear = value.getFullYear();
          return (
            recordYear === currentYear || recordYear === currentYear - 1
          ); // only current or previous year
        },
        message: "Date must be within current or previous year",
      },
    },
    dueDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true; // allow null
          return value >= this.date; // dueDate must be same or after record date
        },
        message: "Due date must be after or same as the record date",
      },
    },
    status: {
      type: String,
      enum: ["paid", "due"],
      default: function () {
        return this.type === "Due" ? "due" : "paid"; // auto-manage based on type
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

const DigitalRecord =
  mongoose.models.DigitalRecord ||
  mongoose.model("DigitalRecord", digitalRecordSchema);

export default DigitalRecord;
