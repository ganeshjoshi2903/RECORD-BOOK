import Customer from '../models/Customer.js';

// GET all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// POST a new customer
export const addCustomer = async (req, res) => {
  console.log("📦 Received customer data:", req.body);
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    console.log("💾 Saved customer:", newCustomer);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer', error });
  }
};

// DELETE a customer by ID
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};
