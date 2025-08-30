import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    capacityMW: { type: Number, required: true },
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

plantSchema.index({ location: "2dsphere" });

export const Plant = mongoose.model("Plant", plantSchema);
