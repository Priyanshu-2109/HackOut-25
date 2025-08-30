import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as zoneController from "../controllers/zoneController.js";

const router = Router();

router.get("/", zoneController.listZones);
router.get("/:id", zoneController.getZone);
router.post("/", verifyJWT, requireAdmin, zoneController.createZone);
router.put("/:id", verifyJWT, requirePlannerOrAdmin, zoneController.updateZone);
router.delete("/:id", verifyJWT, requireAdmin, zoneController.deleteZone);
// Geo queries
router.get("/geo/within", zoneController.zonesWithin);

export default router;
