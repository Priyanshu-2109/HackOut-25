import mongoose from "mongoose";

const hubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    type: {
      type: String,
      enum: ["distribution", "demand", "other"],
      default: "distribution",
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

hubSchema.index({ location: "2dsphere" });

export const DistributionHub = mongoose.model("DistributionHub", hubSchema);
