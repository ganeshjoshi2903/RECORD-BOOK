import express from 'express';
import {
  getAllCustomers,
  addCustomer,
  deleteCustomer,
} from '../controllers/customerController.js';

const router = express.Router();

// GET all customers
router.get('/', getAllCustomers);

// POST a new customer
router.post('/', addCustomer);

// DELETE customer by ID
router.delete('/:id', deleteCustomer); // ✅ VERY IMPORTANT

export default router;
