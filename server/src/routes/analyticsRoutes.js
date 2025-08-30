import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  requireAdmin,
  requirePlannerOrAdmin,
} from "../middlewares/roleMiddleware.js";
import { body, query } from "express-validator";
import {
  getSystemOverview,
  getPerformanceMetrics,
  getPlantSuggestions,
  getStorageSuggestions,
  getPipelineSuggestions,
  optimizeEntireSystem,
  analyzeCostBenefit,
} from "../controllers/analyticsController.js";

const router = express.Router();

// ===========================================
// ADMIN DASHBOARD ROUTES
// ===========================================

// System Overview (Admin only)
router.get("/overview", verifyJWT, requireAdmin, getSystemOverview);

// Performance Metrics (Admin & Planner)
router.get("/metrics", verifyJWT, requirePlannerOrAdmin, getPerformanceMetrics);

// ===========================================
// INTELLIGENT SUGGESTIONS ROUTES
// ===========================================

// Plant Placement Suggestions
router.get(
  "/suggestions/plants",
  verifyJWT,
  requirePlannerOrAdmin,
  query("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),
  query("targetCapacity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Target capacity must be positive"),
  query("location")
    .optional()
    .isJSON()
    .withMessage("Location must be valid JSON"),
  getPlantSuggestions
);

// Storage Placement Suggestions
router.get(
  "/suggestions/storages",
  verifyJWT,
  requirePlannerOrAdmin,
  query("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be a positive number"),
  query("targetCapacity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Target capacity must be positive"),
  query("storageType")
    .optional()
    .isIn(["battery", "pumped_hydro", "compressed_air", "thermal"])
    .withMessage("Invalid storage type"),
  query("location")
    .optional()
    .isJSON()
    .withMessage("Location must be valid JSON"),
  getStorageSuggestions
);

// Pipeline Route Suggestions
router.get(
  "/suggestions/pipelines",
  verifyJWT,
  requirePlannerOrAdmin,
  query("startPoint")
    .optional()
    .isJSON()
    .withMessage("Start point must be valid JSON coordinates"),
  query("endPoint")
    .optional()
    .isJSON()
    .withMessage("End point must be valid JSON coordinates"),
  query("capacity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Capacity must be positive"),
  query("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be positive"),
  getPipelineSuggestions
);

// ===========================================
// SYSTEM OPTIMIZATION ROUTES
// ===========================================

// Comprehensive System Optimization (Admin only)
router.post(
  "/optimize",
  verifyJWT,
  requireAdmin,
  body("objectives")
    .optional()
    .isObject()
    .withMessage("Objectives must be an object"),
  body("constraints")
    .optional()
    .isObject()
    .withMessage("Constraints must be an object"),
  body("timeHorizon")
    .optional()
    .isIn(["1_year", "3_years", "5_years", "10_years"])
    .withMessage("Invalid time horizon"),
  optimizeEntireSystem
);

// Cost-Benefit Analysis
router.post(
  "/cost-benefit",
  verifyJWT,
  requirePlannerOrAdmin,
  body("proposedChanges")
    .isArray()
    .withMessage("Proposed changes must be an array"),
  body("analysisType")
    .isIn(["infrastructure", "operational", "strategic"])
    .withMessage("Invalid analysis type"),
  analyzeCostBenefit
);

export default router;
