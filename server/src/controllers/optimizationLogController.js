import OptimizationLog from "../models/optimizationLogModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const createOptimizationLog = asyncHandler(async (req, res) => {
  const { project, input } = req.body;
  const log = await OptimizationLog.create({
    user: req.user._id,
    project,
    input,
    status: "pending",
  });

  res
    .status(201)
    .json(new ApiResponse(201, log, "Optimization log created successfully"));
});

export const updateOptimizationLog = asyncHandler(async (req, res) => {
  const { output, status, error } = req.body;
  const log = await OptimizationLog.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { output, status, error },
    { new: true }
  );

  if (!log) {
    throw new ApiError(404, "Optimization log not found");
  }

  res.json(new ApiResponse(200, log, "Optimization log updated successfully"));
});

export const getOptimizationLogs = asyncHandler(async (req, res) => {
  const logs = await OptimizationLog.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(
    new ApiResponse(
      200,
      {
        logs,
        count: logs.length,
      },
      "Optimization logs retrieved successfully"
    )
  );
});

export const getOptimizationLogById = asyncHandler(async (req, res) => {
  const log = await OptimizationLog.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!log) {
    throw new ApiError(404, "Optimization log not found");
  }

  res.json(
    new ApiResponse(200, log, "Optimization log retrieved successfully")
  );
});

export const deleteOptimizationLog = asyncHandler(async (req, res) => {
  const log = await OptimizationLog.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!log) {
    throw new ApiError(404, "Optimization log not found");
  }

  res.json(new ApiResponse(200, null, "Optimization log deleted successfully"));
});
