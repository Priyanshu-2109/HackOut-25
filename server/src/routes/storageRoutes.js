import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import * as storageController from "../controllers/storageController.js";

const router = Router();

router.get("/", storageController.listStorages);
router.get("/:id", storageController.getStorage);
router.post("/", verifyJWT, requireAdmin, storageController.createStorage);
router.put(
  "/:id",
  verifyJWT,
  requirePlannerOrAdmin,
  storageController.updateStorage
);
router.delete("/:id", verifyJWT, requireAdmin, storageController.deleteStorage);
// Geo queries
router.get("/geo/within", storageController.storagesWithin);
router.get("/geo/near", storageController.storagesNear);

export default router;
