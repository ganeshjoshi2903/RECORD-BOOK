import express from "express";
import {
  getDashboardData,
  getIncomeRecords,
  getExpenseRecords,
  getDueRecords,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", getDashboardData); // graph + summary
router.get("/income-records", getIncomeRecords); // table
router.get("/expense-records", getExpenseRecords); // table
router.get("/due-records", getDueRecords); // table

export default router;
