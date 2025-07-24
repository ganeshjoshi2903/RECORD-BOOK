import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/profilecontroller.js';
import authMiddleware from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);         // Edit Profile
router.put('/password', authMiddleware, changePassword); // Change Password

export default router;
