const Customer = require('../models/Customer');

// GET all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// POST new customer
const createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create customer' });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer
};
