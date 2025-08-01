import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword, // ✅ Corrected function name
} from '../controllers/profileController.js';
import authMiddleware from '../middleware/authenticate.js';

const router = express.Router();

// ✅ Routes using correct controller methods
router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword); // ✅ Corrected here

export default router;
