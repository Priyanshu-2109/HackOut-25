import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as plantController from "../controllers/plantController.js";

const router = Router();

router.get("/", plantController.listPlants);
router.get("/:id", plantController.getPlant);
router.post("/", verifyJWT, requireAdmin, plantController.createPlant);
router.put(
  "/:id",
  verifyJWT,
  requirePlannerOrAdmin,
  plantController.updatePlant
);
router.delete("/:id", verifyJWT, requireAdmin, plantController.deletePlant);
// Geo queries
router.get("/geo/within", plantController.plantsWithin);
router.get("/geo/near", plantController.plantsNear);

export default router;
