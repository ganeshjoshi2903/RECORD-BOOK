import express from 'express';
import { signup, login, getUserProfile } from '../controllers/authController.js';
import verifyToken from '../middleware/authenticate.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getUserProfile); // ✅ Token protected

export default router;
