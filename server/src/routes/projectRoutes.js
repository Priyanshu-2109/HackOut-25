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
  body("name")
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("assets").isArray().withMessage("Assets must be an array"),
  createProject
);
router.get("/", verifyJWT, getProjects);
router.get("/:id", verifyJWT, param("id").isMongoId(), getProjectById);
router.put(
  "/:id",
  verifyJWT,
  param("id").isMongoId().withMessage("Invalid project ID"),
  body("name")
    .optional()
    .isString()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("assets").optional().isArray().withMessage("Assets must be an array"),
  updateProject
);
router.delete("/:id", verifyJWT, param("id").isMongoId(), deleteProject);

export default router;
