// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // ✅ for login/session if you use cookies

// Import route files
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileroutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import businessRoutes from './routes/businessReportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Middleware
app.use(cors({
  origin: 'https://recordbook-frontend.onrender.com', // ✅ Replace with your real frontend domain
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); // ✅ Needed for JWT cookie auth

// ✅ Health Check Routes
app.get('/', (req, res) => {
  res.send('✅ RecordBook Backend is Live!');
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: '✅ Backend test route working' });
});

// ✅ Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ MongoDB Connection & Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
