import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as demandController from "../controllers/demandController.js";

const router = Router();

router.get("/", demandController.listDemands);
router.get("/:id", demandController.getDemand);
router.post("/", verifyJWT, requireAdmin, demandController.createDemand);
router.put(
  "/:id",
  verifyJWT,
  requirePlannerOrAdmin,
  demandController.updateDemand
);
router.delete("/:id", verifyJWT, requireAdmin, demandController.deleteDemand);
// Geo queries
router.get("/geo/within", demandController.demandsWithin);
router.get("/geo/near", demandController.demandsNear);

export default router;
