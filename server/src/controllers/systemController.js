import { ApiResponse, asyncHandler } from "../utils/api.js";

/**
 * SYSTEM STATUS & HEALTH CONTROLLER
 *
 * This controller handles basic system health checks and status monitoring.
 * For optimization functionality, use /api/analytics/optimize instead.
 */

export const getSystemHealth = asyncHandler(async (req, res) => {
  const healthStatus = {
    status: "operational",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      python_backend: "available",
      api_server: "running",
    },
    version: "1.0.0",
    uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
  };

  res.json(
    new ApiResponse(
      200,
      healthStatus,
      "System health status retrieved successfully"
    )
  );
});

export const getSystemStatus = asyncHandler(async (req, res) => {
  const systemStatus = {
    environment: process.env.NODE_ENV || "development",
    server_time: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    node_version: process.version,
    platform: process.platform,
    architecture: process.arch,
  };

  res.json(
    new ApiResponse(200, systemStatus, "System status retrieved successfully")
  );
});
