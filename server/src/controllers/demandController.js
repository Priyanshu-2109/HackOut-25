import { DemandCenter } from "../models/demandCenterModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listDemands = asyncHandler(async (req, res) => {
  const demands = await DemandCenter.find();
  res.json(new ApiResponse(200, demands));
});

export const getDemand = asyncHandler(async (req, res) => {
  const demand = await DemandCenter.findById(req.params.id);
  if (!demand) throw new ApiError(404, "Demand center not found");
  res.json(new ApiResponse(200, demand));
});

export const createDemand = asyncHandler(async (req, res) => {
  const demand = await DemandCenter.create(req.body);
  res.status(201).json(new ApiResponse(201, demand, "Demand center created"));
});

export const updateDemand = asyncHandler(async (req, res) => {
  const demand = await DemandCenter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!demand) throw new ApiError(404, "Demand center not found");
  res.json(new ApiResponse(200, demand, "Demand center updated"));
});

export const deleteDemand = asyncHandler(async (req, res) => {
  const demand = await DemandCenter.findByIdAndDelete(req.params.id);
  if (!demand) throw new ApiError(404, "Demand center not found");
  res.json(new ApiResponse(200, null, "Demand center deleted"));
});

export const demandsWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const demands = await DemandCenter.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, demands));
});

export const demandsNear = asyncHandler(async (req, res) => {
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const demands = await DemandCenter.find({
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
  res.json(new ApiResponse(200, demands));
});
