const express = require('express');
const router = express.Router();
const { createRecord, getAllRecords } = require('../controllers/digitalRecordController');

router.post('/', createRecord);
router.get('/', getAllRecords);

module.exports = router;
