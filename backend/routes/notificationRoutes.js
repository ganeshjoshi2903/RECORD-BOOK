import express from 'express';
import { getUserNotifications, createNotification } from '../controllers/notificationController.js';
import verifyToken from '../middleware/authenticate.js';

const router = express.Router();

router.get('/user', verifyToken, getUserNotifications);
router.post('/create', verifyToken, createNotification);

export default router;
