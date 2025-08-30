import mongoose from "mongoose";

const regulatoryZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    zoneType: {
      type: String,
      enum: ["restricted", "priority", "neutral"],
      default: "neutral",
    },
    area: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
        default: "Polygon",
      },
      coordinates: { type: [[[Number]]], required: true },
    },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

regulatoryZoneSchema.index({ area: "2dsphere" });

export const RegulatoryZone = mongoose.model(
  "RegulatoryZone",
  regulatoryZoneSchema
);
