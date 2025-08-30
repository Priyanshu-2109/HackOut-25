import mongoose from "mongoose";

const renewableSourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["solar", "wind", "hydro", "other"],
      required: true,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    capacityMW: { type: Number },
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

renewableSourceSchema.index({ location: "2dsphere" });

export const RenewableSource = mongoose.model(
  "RenewableSource",
  renewableSourceSchema
);
