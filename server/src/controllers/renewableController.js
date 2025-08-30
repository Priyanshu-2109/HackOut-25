import { RenewableSource } from "../models/renewableSourceModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listRenewables = asyncHandler(async (req, res) => {
  const renewables = await RenewableSource.find();
  res.json(new ApiResponse(200, renewables));
});

export const getRenewable = asyncHandler(async (req, res) => {
  const renewable = await RenewableSource.findById(req.params.id);
  if (!renewable) throw new ApiError(404, "Renewable source not found");
  res.json(new ApiResponse(200, renewable));
});

export const createRenewable = asyncHandler(async (req, res) => {
  const renewable = await RenewableSource.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, renewable, "Renewable source created"));
});

export const updateRenewable = asyncHandler(async (req, res) => {
  const renewable = await RenewableSource.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!renewable) throw new ApiError(404, "Renewable source not found");
  res.json(new ApiResponse(200, renewable, "Renewable source updated"));
});

export const deleteRenewable = asyncHandler(async (req, res) => {
  const renewable = await RenewableSource.findByIdAndDelete(req.params.id);
  if (!renewable) throw new ApiError(404, "Renewable source not found");
  res.json(new ApiResponse(200, null, "Renewable source deleted"));
});

export const renewablesWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const renewables = await RenewableSource.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, renewables));
});

export const renewablesNear = asyncHandler(async (req, res) => {
  const { lng, lat, max } = req.query;
  if (!lng || !lat || !max) throw new ApiError(400, "lng, lat, max required");
  const renewables = await RenewableSource.find({
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
  res.json(new ApiResponse(200, renewables));
});
