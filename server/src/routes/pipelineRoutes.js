import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as pipelineController from "../controllers/pipelineController.js";

const router = Router();

router.get("/", pipelineController.listPipelines);
router.get("/:id", pipelineController.getPipeline);
router.post("/", verifyJWT, requireAdmin, pipelineController.createPipeline);
router.put(
  "/:id",
  verifyJWT,
  requirePlannerOrAdmin,
  pipelineController.updatePipeline
);
router.delete(
  "/:id",
  verifyJWT,
  requireAdmin,
  pipelineController.deletePipeline
);
// Geo queries
router.get("/geo/within", pipelineController.pipelinesWithin);
router.get("/geo/near", pipelineController.pipelinesNear);

export default router;
