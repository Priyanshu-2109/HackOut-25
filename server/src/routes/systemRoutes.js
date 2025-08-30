import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  getSystemHealth,
  getSystemStatus,
} from "../controllers/systemController.js";

const router = Router();

// System health and status endpoints
router.get("/health", getSystemHealth);
router.get("/status", verifyJWT, getSystemStatus);

export default router;
