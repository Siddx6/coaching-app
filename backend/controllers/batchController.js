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

module.exports = { createBatch, getBatches };