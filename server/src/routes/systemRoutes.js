import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { optimizeSystem } from "../controllers/systemController.js";

const router = Router();
router.post("/optimize", verifyJWT, optimizeSystem);
export default router;
