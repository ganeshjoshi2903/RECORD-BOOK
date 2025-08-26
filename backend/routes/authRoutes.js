import express from "express";
import { signup, login, getUserProfile } from "../controllers/authController.js";
import { sendResetLink } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";
import verifyToken from "../middleware/authenticate.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getUserProfile);

router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:token", resetPassword);

export default router;