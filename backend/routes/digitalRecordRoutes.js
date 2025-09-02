import express from "express";
import {
  createRecord,
  getRecords,
  deleteRecord,
  updateRecord,
  getDueRecords,
  exportRecordsPDF,
  getDailySummary,   // ✅ added
} from "../controllers/digitalRecordController.js";

const router = express.Router();

router.post("/", createRecord);
router.get("/", getRecords);
router.get("/due", getDueRecords);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

// ✅ Export PDF Route
router.get("/export/pdf", exportRecordsPDF);

// ✅ Daily Summary Route
router.get("/summary/daily", getDailySummary);

export default router;
