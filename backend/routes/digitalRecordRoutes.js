    import express from 'express';
    import { createRecord, getRecords, deleteRecord } from '../controllers/digitalRecordController.js';

    const router = express.Router();

    router.post('/', createRecord);
    router.get('/', getRecords);
    router.delete('/:id', deleteRecord); // ✅ DELETE route

    export default router;