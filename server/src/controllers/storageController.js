import { Storage } from "../models/storageModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listStorages = asyncHandler(async (req, res) => {
  const storages = await Storage.find();
  res.json(new ApiResponse(200, storages));
});

export const getStorage = asyncHandler(async (req, res) => {
  const storage = await Storage.findById(req.params.id);
  if (!storage) throw new ApiError(404, "Storage not found");
  res.json(new ApiResponse(200, storage));
});

export const createStorage = asyncHandler(async (req, res) => {
  const storage = await Storage.create(req.body);
  res.status(201).json(new ApiResponse(201, storage, "Storage created"));
});

export const updateStorage = asyncHandler(async (req, res) => {
  const storage = await Storage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!storage) throw new ApiError(404, "Storage not found");
  res.json(new ApiResponse(200, storage, "Storage updated"));
});

export const deleteStorage = asyncHandler(async (req, res) => {
  const storage = await Storage.findByIdAndDelete(req.params.id);
  if (!storage) throw new ApiError(404, "Storage not found");
  res.json(new ApiResponse(200, null, "Storage deleted"));
});

export const storagesWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const storages = await Storage.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, storages));
});

export const storagesNear = asyncHandler(async (req, res) => {
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const storages = await Storage.find({
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
  res.json(new ApiResponse(200, storages));
});
