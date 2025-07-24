import express from 'express';
import { signup, login, getUserProfile } from '../controllers/authController.js';
import verifyToken from '../middleware/authenticate.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile);

export default router;
