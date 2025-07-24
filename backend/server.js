import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileroutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js';      // ✅ Add this
import dashboardRoutes from './routes/dashboardRoutes.js';       // ✅ Add this
import customerRoutes from './routes/customerRoutes.js';         // ✅ If using
import businessRoutes from './routes/businessReportRoutes.js';         // ✅ If using

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/records', recordRoutes);              // ✅ Mount route
app.use('/api/dashboard', dashboardRoutes);         // ✅ Mount route
app.use('/api/customers', customerRoutes);          // ✅ Mount if needed
app.use('/api/business', businessRoutes);           // ✅ Mount if needed

// DB + Server Start
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
