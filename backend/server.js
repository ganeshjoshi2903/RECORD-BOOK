import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileroutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js'; // ✅ Fixed this
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import businessRoutes from './routes/businessReportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/records', recordRoutes); // ✅ now correct
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/notifications', notificationRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
