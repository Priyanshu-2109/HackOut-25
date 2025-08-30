import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  createOptimizationLog,
  updateOptimizationLog,
  getOptimizationLogs,
  getOptimizationLogById,
} from "../controllers/optimizationLogController.js";

const router = express.Router();

router.post("/", verifyJWT, createOptimizationLog);
router.put("/:id", verifyJWT, updateOptimizationLog);
router.get("/", verifyJWT, getOptimizationLogs);
router.get("/:id", verifyJWT, getOptimizationLogById);

export default router;
