import express from "express";
import { forgotPassword } from "../controllers/forgotPasswordController.js";

const router = express.Router();

// No auth middleware, because user might be logged out
router.post("/forgot-password", forgotPassword);

export default router;
