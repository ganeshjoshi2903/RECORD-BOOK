import express from 'express';
import {
  getDashboardStats,
  getIncomeRecords,
  getExpenseRecords,
  getDueRecords,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', getDashboardStats);
router.get('/income-records', getIncomeRecords);
router.get('/expense-records', getExpenseRecords);
router.get('/due-records', getDueRecords);

export default router;