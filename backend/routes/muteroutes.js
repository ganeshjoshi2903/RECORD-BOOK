import express from "express";
import { getMuteState, toggleMute } from "../controllers/mutecontroller.js";

const router = express.Router();

router.get("/reminder", getMuteState);
router.patch("/reminder", toggleMute);

export default router;


