import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { body, param } from "express-validator";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post(
  "/",
  verifyJWT,
  body("name").isString().isLength({ min: 2, max: 100 }),
  body("description").optional().isString().isLength({ max: 500 }),
  body("assets").isArray(),
  createProject
);
router.get("/", verifyJWT, getProjects);
router.get("/:id", verifyJWT, param("id").isMongoId(), getProjectById);
router.put(
  "/:id",
  verifyJWT,
  param("id").isMongoId(),
  body("name").optional().isString().isLength({ min: 2, max: 100 }),
  body("description").optional().isString().isLength({ max: 500 }),
  body("assets").optional().isArray(),
  updateProject
);
router.delete("/:id", verifyJWT, param("id").isMongoId(), deleteProject);

export default router;
