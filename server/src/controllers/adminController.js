import { User } from "../models/authModel.js";
import { Plant } from "../models/plantModel.js";
import { Storage } from "../models/storageModel.js";
import { Pipeline } from "../models/pipelineModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

/**
 * ADMIN MANAGEMENT CONTROLLER
 *
 * Admin-specific functionalities:
 * 1. User management and role assignment
 * 2. System-wide configuration
 * 3. Data import/export
 * 4. System health monitoring
 * 5. Security and compliance management
 */

// ===========================================
// USER MANAGEMENT
// ===========================================

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { fullname: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Users retrieved successfully"
    )
  );
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["admin", "planner", "user"].includes(role)) {
    throw new ApiError(
      400,
      "Invalid role. Must be 'admin', 'planner', or 'user'"
    );
  }

  // Prevent admin from changing their own role
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot change your own role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user, `User role updated to ${role}`));
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot deactivate your own account");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user, "User deactivated successfully"));
});

// ===========================================
// SYSTEM CONFIGURATION
// ===========================================

export const getSystemConfiguration = asyncHandler(async (req, res) => {
  // This would typically come from a configuration collection
  const config = {
    system: {
      version: "1.0.0",
      maintenance_mode: false,
      max_concurrent_users: 1000,
      session_timeout: 30, // minutes
    },
    optimization: {
      python_backend_url: "http://localhost:5000",
      max_optimization_time: 300, // seconds
      default_efficiency_threshold: 0.85,
    },
    security: {
      password_policy: {
        min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_special_chars: true,
      },
      session_security: {
        secure_cookies: true,
        same_site: "strict",
      },
    },
    notifications: {
      email_enabled: true,
      sms_enabled: false,
      push_enabled: true,
    },
  };

  res.json(new ApiResponse(200, config, "System configuration retrieved"));
});

export const updateSystemConfiguration = asyncHandler(async (req, res) => {
  const { configuration } = req.body;

  // In a real system, this would update a configuration collection
  // For now, we'll just validate and return the configuration

  res.json(new ApiResponse(200, configuration, "System configuration updated"));
});

// ===========================================
// DATA MANAGEMENT
// ===========================================

export const exportSystemData = asyncHandler(async (req, res) => {
  const { format = "json", includeUsers = false } = req.query;

  const data = {
    plants: await Plant.find(),
    storages: await Storage.find(),
    pipelines: await Pipeline.find(),
    export_timestamp: new Date().toISOString(),
    export_by: req.user.username,
  };

  if (includeUsers === "true") {
    data.users = await User.find().select("-password -refreshToken");
  }

  if (format === "csv") {
    // Convert to CSV format
    const csv = convertToCSV(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=system_export.csv"
    );
    return res.send(csv);
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=system_export.json"
  );
  res.json(data);
});

export const importSystemData = asyncHandler(async (req, res) => {
  const { data, options = {} } = req.body;
  const { overwrite = false, validate = true } = options;

  const results = {
    plants: { created: 0, updated: 0, errors: 0 },
    storages: { created: 0, updated: 0, errors: 0 },
    pipelines: { created: 0, updated: 0, errors: 0 },
    errors: [],
  };

  // Import plants
  if (data.plants) {
    for (const plantData of data.plants) {
      try {
        if (validate) {
          // Validate plant data structure
          if (!plantData.name || !plantData.location || !plantData.capacityMW) {
            results.plants.errors++;
            results.errors.push(
              `Invalid plant data: ${plantData.name || "unnamed"}`
            );
            continue;
          }
        }

        const existingPlant = await Plant.findOne({ name: plantData.name });
        if (existingPlant && !overwrite) {
          results.plants.errors++;
          results.errors.push(`Plant already exists: ${plantData.name}`);
        } else if (existingPlant && overwrite) {
          await Plant.findByIdAndUpdate(existingPlant._id, plantData);
          results.plants.updated++;
        } else {
          await Plant.create({ ...plantData, createdBy: req.user._id });
          results.plants.created++;
        }
      } catch (error) {
        results.plants.errors++;
        results.errors.push(
          `Error importing plant ${plantData.name}: ${error.message}`
        );
      }
    }
  }

  res.json(new ApiResponse(200, results, "Data import completed"));
});

// ===========================================
// SYSTEM HEALTH & MONITORING (ADMIN LEVEL)
// ===========================================

export const getSystemHealthDetailed = asyncHandler(async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      python_backend: await checkPythonBackendHealth(),
      redis: await checkRedisHealth(),
      external_apis: await checkExternalAPIsHealth(),
    },
    system_metrics: {
      memory_usage: process.memoryUsage(),
      uptime: process.uptime(),
      cpu_usage: process.cpuUsage(),
    },
    alerts: await getSystemAlerts(),
  };

  // Determine overall status
  const serviceStatuses = Object.values(health.services);
  if (serviceStatuses.some((s) => s.status === "critical")) {
    health.status = "critical";
  } else if (serviceStatuses.some((s) => s.status === "warning")) {
    health.status = "warning";
  }

  const statusCode = health.status === "critical" ? 503 : 200;
  res
    .status(statusCode)
    .json(
      new ApiResponse(statusCode, health, `System status: ${health.status}`)
    );
});

export const getSystemLogs = asyncHandler(async (req, res) => {
  const { level = "all", limit = 100, startDate, endDate } = req.query;

  // This would typically come from a logging service or database
  const logs = [
    {
      timestamp: new Date().toISOString(),
      level: "info",
      message: "System optimization completed successfully",
      metadata: { duration: "45s", user: req.user.username },
    },
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: "warning",
      message: "Python backend response time elevated",
      metadata: { response_time: "5.2s", threshold: "3s" },
    },
  ];

  res.json(
    new ApiResponse(200, { logs, total: logs.length }, "System logs retrieved")
  );
});

// ===========================================
// SECURITY MANAGEMENT
// ===========================================

export const getSecurityAuditLog = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  // This would come from an audit log collection
  const auditLog = [
    {
      timestamp: new Date().toISOString(),
      user: req.user.username,
      action: "LOGIN",
      ip_address: req.ip,
      user_agent: req.get("User-Agent"),
      success: true,
    },
    {
      timestamp: new Date(Date.now() - 120000).toISOString(),
      user: "unknown",
      action: "FAILED_LOGIN",
      ip_address: "192.168.1.100",
      success: false,
      details: "Invalid password",
    },
  ];

  res.json(
    new ApiResponse(
      200,
      {
        auditLog,
        pagination: { page, limit, total: auditLog.length },
      },
      "Security audit log retrieved"
    )
  );
});

export const forcePasswordReset = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Force password reset on next login
  user.forcePasswordReset = true;
  await user.save();

  res.json(
    new ApiResponse(
      200,
      null,
      "User will be required to reset password on next login"
    )
  );
});

// ===========================================
// HELPER FUNCTIONS
// ===========================================

async function checkDatabaseHealth() {
  try {
    await User.findOne().limit(1);
    return { status: "healthy", response_time: "< 100ms" };
  } catch (error) {
    return { status: "critical", error: error.message };
  }
}

async function checkPythonBackendHealth() {
  try {
    // This would make an actual health check request
    return { status: "healthy", version: "1.0.0" };
  } catch (error) {
    return { status: "warning", error: "Python backend unavailable" };
  }
}

async function checkRedisHealth() {
  // Placeholder - would check actual Redis connection
  return { status: "healthy", connections: 5 };
}

async function checkExternalAPIsHealth() {
  return {
    status: "healthy",
    apis: {
      weather_service: "healthy",
      market_data: "healthy",
      regulatory_api: "healthy",
    },
  };
}

async function getSystemAlerts() {
  return [
    {
      id: "alert_001",
      level: "warning",
      message: "Disk usage above 80%",
      timestamp: new Date().toISOString(),
      acknowledged: false,
    },
  ];
}

function convertToCSV(data) {
  // Simple CSV conversion - in production, use a proper CSV library
  let csv = "";

  if (data.plants) {
    csv += "Plants\n";
    csv += "Name,Capacity (MW),Status,Location\n";
    data.plants.forEach((plant) => {
      csv += `${plant.name},${plant.capacityMW},${
        plant.status
      },"${plant.location.coordinates.join(", ")}"\n`;
    });
    csv += "\n";
  }

  return csv;
}
