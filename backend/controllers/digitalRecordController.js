import DigitalRecord from "../models/DigitalRecord.js";
import Notification from "../models/notification.js";
import PDFDocument from "pdfkit";

/**
 * ✅ Create a new record with date validation
 */
export const createRecord = async (req, res) => {
  try {
    const { type, category, amount, date, dueDate, status } = req.body;

    const today = new Date();
    const recordDate = new Date(date);

    if (isNaN(recordDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (
      recordDate.getFullYear() < today.getFullYear() - 1 ||
      recordDate > today
    ) {
      return res.status(400).json({
        message: "Date must be from current or previous year, not future",
      });
    }

    if (type === "Due") {
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) {
        return res.status(400).json({ message: "Invalid due date format" });
      }
      if (due < recordDate) {
        return res
          .status(400)
          .json({ message: "Due Date cannot be earlier than record date" });
      }
    }

    const newRecord = new DigitalRecord({
      type,
      category,
      amount,
      date: recordDate,
      dueDate: type === "Due" ? dueDate : null,
      status: type === "Due" ? status || "due" : "paid",
    });

    await newRecord.save();

    await Notification.create({
      recordId: newRecord._id,
      message:
        type === "Due"
          ? `New Due of ₹${amount} added (Due Date: ${
              dueDate ? new Date(dueDate).toLocaleDateString() : "Not set"
            })`
          : `${type} of ₹${amount} added in ${category}`,
      type: type.toLowerCase(),
    });

    if (type === "Due" && dueDate) {
      const due = new Date(dueDate);
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - 1);

      if (reminderDate > new Date()) {
        await Notification.create({
          recordId: newRecord._id,
          message: `Reminder: Due of ₹${amount} is tomorrow (${due.toLocaleDateString()})`,
          type: "reminder",
        });
      }
    }

    res.status(201).json(newRecord);
  } catch (err) {
    console.error("❌ Failed to create record:", err.message);
    res.status(500).json({ message: "Failed to create record" });
  }
};

/**
 * ✅ Get all records
 */
export const getRecords = async (req, res) => {
  try {
    const records = await DigitalRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Failed to fetch records:", err.message);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

/**
 * ✅ Get only due records
 */
export const getDueRecords = async (req, res) => {
  try {
    const today = new Date();
    const dueRecords = await DigitalRecord.find({
      type: "Due",
      status: "due",
      dueDate: { $lte: today },
    })
      .sort({ dueDate: 1 })
      .lean();

    res.json(dueRecords);
  } catch (err) {
    console.error("❌ Error in getDueRecords:", err.message);
    res.status(500).json({ message: "Failed to fetch due records" });
  }
};

/**
 * ✅ Delete record
 */
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DigitalRecord.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    await Notification.deleteMany({ recordId: id });
    res.json({ message: "Record & related notifications deleted", id });
  } catch (err) {
    console.error("❌ Failed to delete record:", err.message);
    res.status(500).json({ message: "Failed to delete record" });
  }
};

/**
 * ✅ Update record
 */
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, dueDate, type } = req.body;

    if (date) {
      const today = new Date();
      const recordDate = new Date(date);

      if (
        recordDate.getFullYear() < today.getFullYear() - 1 ||
        recordDate > today
      ) {
        return res.status(400).json({
          message: "Date must be from current or previous year, not future",
        });
      }
    }

    if (type === "Due" && dueDate) {
      const recDate = new Date(date || new Date());
      const due = new Date(dueDate);

      if (due < recDate) {
        return res
          .status(400)
          .json({ message: "Due Date cannot be earlier than record date" });
      }
    }

    const updated = await DigitalRecord.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Record not found" });
    }

    await Notification.deleteMany({ recordId: id, type: "reminder" });

    if (updated.type === "Due" && updated.dueDate) {
      const due = new Date(updated.dueDate);
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - 1);

      if (reminderDate > new Date()) {
        await Notification.create({
          recordId: updated._id,
          message: `Reminder: Due of ₹${updated.amount} is tomorrow (${due.toLocaleDateString()})`,
          type: "reminder",
        });
      }
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update record:", err.message);
    res.status(500).json({ message: "Failed to update record" });
  }
};

/**
 * ✅ Export Records as PDF
 */
export const exportRecordsPDF = async (req, res) => {
  try {
    const { days } = req.query;
    const filterDate = new Date();
    filterDate.setDate(filterDate.getDate() - (days || 1));

    const records = await DigitalRecord.find({
      date: { $gte: filterDate },
    }).sort({ date: -1 });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="records_${days || 1}days.pdf"`
    );

    doc.pipe(res);
    doc.fontSize(18).text("📒 Digital Records Report", { align: "center" });
    doc.moveDown();

    records.forEach((rec, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${rec.type} | ${rec.category} | ₹${rec.amount} | ${new Date(
            rec.date
          ).toLocaleDateString()} ${
            rec.dueDate
              ? "| Due: " + new Date(rec.dueDate).toLocaleDateString()
              : ""
          }`
        );
      doc.moveDown(0.5);
    });

    if (records.length === 0) {
      doc.text("No records found for selected period.", { align: "center" });
    }

    doc.end();
  } catch (err) {
    console.error("❌ PDF export error:", err.message);
    res.status(500).json({ message: "Failed to export PDF" });
  }
};

/**
 * ✅ Daily Summary (Income, Expense, Due totals)
 */
export const getDailySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const incomeAgg = await DigitalRecord.aggregate([
      { $match: { type: "Income", date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenseAgg = await DigitalRecord.aggregate([
      { $match: { type: "Expense", date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const dueAgg = await DigitalRecord.aggregate([
      { $match: { type: "Due", date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      income: incomeAgg[0]?.total || 0,
      expense: expenseAgg[0]?.total || 0,
      due: dueAgg[0]?.total || 0,
    });
  } catch (err) {
    console.error("❌ Failed to fetch daily summary:", err.message);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};
