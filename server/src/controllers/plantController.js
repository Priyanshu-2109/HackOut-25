import { Plant } from "../models/plantModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listPlants = asyncHandler(async (req, res) => {
  const plants = await Plant.find();
  res.json(new ApiResponse(200, plants));
});

export const getPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  if (!plant) throw new ApiError(404, "Plant not found");
  res.json(new ApiResponse(200, plant));
});

export const createPlant = asyncHandler(async (req, res) => {
  const plant = await Plant.create(req.body);
  res.status(201).json(new ApiResponse(201, plant, "Plant created"));
});

export const updatePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!plant) throw new ApiError(404, "Plant not found");
  res.json(new ApiResponse(200, plant, "Plant updated"));
});

export const deletePlant = asyncHandler(async (req, res) => {
  const plant = await Plant.findByIdAndDelete(req.params.id);
  if (!plant) throw new ApiError(404, "Plant not found");
  res.json(new ApiResponse(200, null, "Plant deleted"));
});

export const plantsWithin = asyncHandler(async (req, res) => {
  // /geo/within?lng=..&lat=..&radius=.. (km)
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const plants = await Plant.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, plants));
});

export const plantsNear = asyncHandler(async (req, res) => {
  // /geo/near?lng=..&lat=..&max=.. (km)
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const plants = await Plant.find({
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
  res.json(new ApiResponse(200, plants));
});
