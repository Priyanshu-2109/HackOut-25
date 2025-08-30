import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    required: true,
  },
  assetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Favorite", favoriteSchema);
