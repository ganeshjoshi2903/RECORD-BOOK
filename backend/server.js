import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import all route files
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileRoutes from './routes/profileroutes.js';

dotenv.config(); // Load env variables

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173','https://recordbook-3map.onrender.com'], // Frontend origin
  credentials: true,                // Allow cookies
}));
app.use(express.json());           // Parse JSON bodies
app.use(cookieParser());           // Parse cookies

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/customers', customerRoutes); // 💡 This route handles customer CRUD
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () =>
      console.log(`🚀 Server is running at http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
