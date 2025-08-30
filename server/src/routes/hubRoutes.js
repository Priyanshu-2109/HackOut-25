import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as hubController from "../controllers/hubController.js";

const router = Router();

router.get("/", hubController.listHubs);
router.get("/:id", hubController.getHub);
router.post("/", verifyJWT, requireAdmin, hubController.createHub);
router.put("/:id", verifyJWT, requirePlannerOrAdmin, hubController.updateHub);
router.delete("/:id", verifyJWT, requireAdmin, hubController.deleteHub);
// Geo queries
router.get("/geo/within", hubController.hubsWithin);
router.get("/geo/near", hubController.hubsNear);

export default router;
