// Middleware to check for admin role
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
}

// Middleware to check for planner or admin
export function requirePlannerOrAdmin(req, res, next) {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "planner")) {
    return res
      .status(403)
      .json({ success: false, message: "Planner or admin access required" });
  }
  next();
}
