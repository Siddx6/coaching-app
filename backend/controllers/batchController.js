const Batch = require("../models/Batch");

const createBatch = async (req, res) => {
  try {
    const { subCourse, name, startDate, monthlyFee, oneTimeFee } = req.body;
    const batch = await Batch.create({ subCourse, name, startDate, monthlyFee, oneTimeFee });
    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate("subCourse").sort({ createdAt: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json(batch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json({ message: "Batch deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBatch, getBatches, updateBatch, deleteBatch };