import express from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { body, query, param } from "express-validator";
import {
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getSystemConfiguration,
  updateSystemConfiguration,
  exportSystemData,
  importSystemData,
  getSystemHealthDetailed,
  getSystemLogs,
  getSecurityAuditLog,
  forcePasswordReset,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require admin authentication
router.use(verifyJWT, requireAdmin);

// ===========================================
// USER MANAGEMENT ROUTES
// ===========================================

router.get(
  "/users",
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("role")
    .optional()
    .isIn(["admin", "planner", "user"])
    .withMessage("Invalid role filter"),
  getAllUsers
);

router.put(
  "/users/:userId/role",
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("role")
    .isIn(["admin", "planner", "user"])
    .withMessage("Role must be admin, planner, or user"),
  updateUserRole
);

router.put(
  "/users/:userId/deactivate",
  param("userId").isMongoId().withMessage("Invalid user ID"),
  deactivateUser
);

router.post(
  "/users/:userId/force-password-reset",
  param("userId").isMongoId().withMessage("Invalid user ID"),
  forcePasswordReset
);

// ===========================================
// SYSTEM CONFIGURATION ROUTES
// ===========================================

router.get("/config", getSystemConfiguration);

router.put(
  "/config",
  body("configuration")
    .isObject()
    .withMessage("Configuration must be an object"),
  updateSystemConfiguration
);

// ===========================================
// DATA MANAGEMENT ROUTES
// ===========================================

router.get(
  "/export",
  query("format")
    .optional()
    .isIn(["json", "csv"])
    .withMessage("Format must be json or csv"),
  query("includeUsers")
    .optional()
    .isBoolean()
    .withMessage("includeUsers must be boolean"),
  exportSystemData
);

router.post(
  "/import",
  body("data").isObject().withMessage("Data must be an object"),
  body("options")
    .optional()
    .isObject()
    .withMessage("Options must be an object"),
  importSystemData
);

// ===========================================
// SYSTEM MONITORING ROUTES
// ===========================================

router.get("/health", getSystemHealthDetailed);

router.get(
  "/logs",
  query("level")
    .optional()
    .isIn(["error", "warning", "info", "debug", "all"])
    .withMessage("Invalid log level"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Limit must be between 1 and 1000"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be valid ISO8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be valid ISO8601 date"),
  getSystemLogs
);

// ===========================================
// SECURITY MANAGEMENT ROUTES
// ===========================================

router.get(
  "/security/audit-log",
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 500 })
    .withMessage("Limit must be between 1 and 500"),
  getSecurityAuditLog
);

export default router;
