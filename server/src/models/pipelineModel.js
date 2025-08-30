import mongoose from "mongoose";

const pipelineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: {
      type: {
        type: String,
        enum: ["LineString"],
        required: true,
        default: "LineString",
      },
      coordinates: { type: [[Number]], required: true }, // [[lng, lat], ...]
    },
    capacityTonnesPerDay: { type: Number, required: true },
    status: {
      type: String,
      enum: ["existing", "planned"],
      default: "existing",
    },
    commissioningDate: { type: Date },
    owner: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

pipelineSchema.index({ path: "2dsphere" });

export const Pipeline = mongoose.model("Pipeline", pipelineSchema);
