import Project from "../models/projectModel.js";
import { validationResult } from "express-validator";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const createProject = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Name length:", req.body.name?.length);
  console.log("Description length:", req.body.description?.length);

  // Check validation errors
  const errors = validationResult(req);
  console.log("Validation errors:", errors.array());

  if (!errors.isEmpty()) {
    throw new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }))
    );
  }

  const { name, description, assets } = req.body;
  const project = await Project.create({
    name,
    description,
    user: req.user._id,
    assets,
  });

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });

  res.json(
    new ApiResponse(
      200,
      {
        projects,
        count: projects.length,
      },
      "Projects retrieved successfully"
    )
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }))
    );
  }

  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.json(new ApiResponse(200, project, "Project retrieved successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }))
    );
  }

  const { name, description, assets } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { name, description, assets },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }))
    );
  }

  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  res.json(new ApiResponse(200, null, "Project deleted successfully"));
});
