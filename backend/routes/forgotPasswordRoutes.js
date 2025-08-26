import express from "express";
import { sendResetLink } from "../controllers/forgotPasswordController.js";
import { resetPassword } from "../controllers/resetPasswordController.js";

const router = express.Router();

router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:token", resetPassword);

export default router;