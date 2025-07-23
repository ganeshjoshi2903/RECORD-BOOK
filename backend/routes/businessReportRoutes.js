import express from 'express';
import {
  createReport,
  getReports,
  getMonthlyReportSummary
} from '../controllers/businessReportController.js';

const router = express.Router();

router.post('/create', createReport);
router.get('/', getReports);
router.get('/monthly-summary', getMonthlyReportSummary);

export default router;
