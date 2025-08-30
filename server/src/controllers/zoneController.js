import { RegulatoryZone } from "../models/regulatoryZoneModel.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/api.js";

export const listZones = asyncHandler(async (req, res) => {
  const zones = await RegulatoryZone.find();
  res.json(new ApiResponse(200, zones));
});

export const getZone = asyncHandler(async (req, res) => {
  const zone = await RegulatoryZone.findById(req.params.id);
  if (!zone) throw new ApiError(404, "Zone not found");
  res.json(new ApiResponse(200, zone));
});

export const createZone = asyncHandler(async (req, res) => {
  const zone = await RegulatoryZone.create(req.body);
  res.status(201).json(new ApiResponse(201, zone, "Zone created"));
});

export const updateZone = asyncHandler(async (req, res) => {
  const zone = await RegulatoryZone.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!zone) throw new ApiError(404, "Zone not found");
  res.json(new ApiResponse(200, zone, "Zone updated"));
});

export const deleteZone = asyncHandler(async (req, res) => {
  const zone = await RegulatoryZone.findByIdAndDelete(req.params.id);
  if (!zone) throw new ApiError(404, "Zone not found");
  res.json(new ApiResponse(200, null, "Zone deleted"));
});

export const zonesWithin = asyncHandler(async (req, res) => {
  const { lng, lat, radius } = req.query;
  if (!lng || !lat || !radius)
    throw new ApiError(400, "lng, lat, radius required");
  const zones = await RegulatoryZone.find({
    area: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lng), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ],
      },
    },
  });
  res.json(new ApiResponse(200, zones));
});
