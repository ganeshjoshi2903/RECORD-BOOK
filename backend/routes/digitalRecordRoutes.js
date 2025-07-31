import express from 'express';
import { createRecord, getRecords } from '../controllers/digitalRecordController.js';

const router = express.Router();

router.post('/', createRecord);
router.get('/', getRecords);

export default router;