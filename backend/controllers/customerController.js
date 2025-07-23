import Customer from '../models/Customer.js';

// GET all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

// POST create a customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      phone
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer' });
  }
};
