import { Pipeline } from "../models/pipelineModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listPipelines = asyncHandler(async (req, res) => {
  const pipelines = await Pipeline.find();
  res.json(new ApiResponse(200, pipelines));
});

export const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findById(req.params.id);
  if (!pipeline) throw new ApiError(404, "Pipeline not found");
  res.json(new ApiResponse(200, pipeline));
});

export const createPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.create(req.body);
  res.status(201).json(new ApiResponse(201, pipeline, "Pipeline created"));
});

export const updatePipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!pipeline) throw new ApiError(404, "Pipeline not found");
  res.json(new ApiResponse(200, pipeline, "Pipeline updated"));
});

export const deletePipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findByIdAndDelete(req.params.id);
  if (!pipeline) throw new ApiError(404, "Pipeline not found");
  res.json(new ApiResponse(200, null, "Pipeline deleted"));
});

export const pipelinesWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const pipelines = await Pipeline.find({
    path: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, pipelines));
});

export const pipelinesNear = asyncHandler(async (req, res) => {
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const pipelines = await Pipeline.find({
    path: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseFloat(max) * 1000,
      },
    },
  });
  res.json(new ApiResponse(200, pipelines));
});
