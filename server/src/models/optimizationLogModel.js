import mongoose from "mongoose";

const optimizationLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  input: { type: Object, required: true },
  output: { type: Object },
  status: {
    type: String,
    enum: ["pending", "success", "error"],
    default: "pending",
  },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OptimizationLog", optimizationLogSchema);
