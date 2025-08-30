import { DistributionHub } from "../models/hubModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listHubs = asyncHandler(async (req, res) => {
  const hubs = await DistributionHub.find();
  res.json(new ApiResponse(200, hubs));
});

export const getHub = asyncHandler(async (req, res) => {
  const hub = await DistributionHub.findById(req.params.id);
  if (!hub) throw new ApiError(404, "Hub not found");
  res.json(new ApiResponse(200, hub));
});

export const createHub = asyncHandler(async (req, res) => {
  const hub = await DistributionHub.create(req.body);
  res.status(201).json(new ApiResponse(201, hub, "Hub created"));
});

export const updateHub = asyncHandler(async (req, res) => {
  const hub = await DistributionHub.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!hub) throw new ApiError(404, "Hub not found");
  res.json(new ApiResponse(200, hub, "Hub updated"));
});

export const deleteHub = asyncHandler(async (req, res) => {
  const hub = await DistributionHub.findByIdAndDelete(req.params.id);
  if (!hub) throw new ApiError(404, "Hub not found");
  res.json(new ApiResponse(200, null, "Hub deleted"));
});

export const hubsWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const hubs = await DistributionHub.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, hubs));
});

export const hubsNear = asyncHandler(async (req, res) => {
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const hubs = await DistributionHub.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseFloat(max) * 1000,
      },
    },
  });
  res.json(new ApiResponse(200, hubs));
});
