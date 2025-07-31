import Customer from '../models/Customer.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, photo, balance } = req.body;

    const newCustomer = new Customer({
      name,
      phone,
      photo,
      balance,
      history: [],
    });

    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create customer' });
  }
};
