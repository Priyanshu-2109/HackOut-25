import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as renewableController from "../controllers/renewableController.js";

const router = Router();

router.get("/", renewableController.listRenewables);
router.get("/:id", renewableController.getRenewable);
router.post("/", verifyJWT, requireAdmin, renewableController.createRenewable);
router.put(
  "/:id",
  verifyJWT,
  requirePlannerOrAdmin,
  renewableController.updateRenewable
);
router.delete(
  "/:id",
  verifyJWT,
  requireAdmin,
  renewableController.deleteRenewable
);
// Geo queries
router.get("/geo/within", renewableController.renewablesWithin);
router.get("/geo/near", renewableController.renewablesNear);

export default router;
