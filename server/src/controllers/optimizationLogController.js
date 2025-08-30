import OptimizationLog from "../models/optimizationLogModel.js";

export const createOptimizationLog = async (req, res) => {
  try {
    const { project, input } = req.body;
    const log = await OptimizationLog.create({
      user: req.user._id,
      project,
      input,
      status: "pending",
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOptimizationLog = async (req, res) => {
  try {
    const { output, status, error } = req.body;
    const log = await OptimizationLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { output, status, error },
      { new: true }
    );
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getOptimizationLogs = async (req, res) => {
  try {
    const logs = await OptimizationLog.find({ user: req.user._id });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOptimizationLogById = async (req, res) => {
  try {
    const log = await OptimizationLog.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
