import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileroutes.js';
import recordRoutes from './routes/digitalRecordRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import businessRoutes from './routes/businessReportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// ✅ Allow CORS from frontend domain or all origins for dev
const allowedOrigins = [
  'http://localhost:5173',         // for local dev
  'https://your-frontend.onrender.com' // 🔁 Replace with your frontend live URL
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ SPA static + fallback (for production Vite React build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../dist');

app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ DB + Start Server
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
