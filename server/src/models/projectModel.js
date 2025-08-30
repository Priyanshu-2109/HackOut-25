import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assets: [
    {
      assetType: {
        type: String,
        enum: [
          "Plant",
          "Storage",
          "Pipeline",
          "Hub",
          "RenewableSource",
          "DemandCenter",
          "RegulatoryZone",
        ],
      },
      assetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", projectSchema);
