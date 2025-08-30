import mongoose from "mongoose";

const demandCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    demandMW: { type: Number },
    type: {
      type: String,
      enum: ["industrial", "urban", "other"],
      default: "urban",
    },
    status: {
      type: String,
      enum: ["existing", "planned"],
      default: "existing",
    },
    owner: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

demandCenterSchema.index({ location: "2dsphere" });

export const DemandCenter = mongoose.model("DemandCenter", demandCenterSchema);
