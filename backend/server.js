import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// import your routes
import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Explicitly define allowed origins, methods, and headers for CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
    // Check if the incoming request's origin is in our allowed list
    // Or if there's no origin (e.g., for same-origin requests or tools like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request and reflect the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow cookies to be sent with cross-origin requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow common HTTP methods, including OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow common headers. Add any other custom headers your client sends.
}));

app.use(express.json()); // Middleware to parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
});
