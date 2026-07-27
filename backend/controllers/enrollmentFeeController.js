const EnrollmentFee = require("../models/EnrollmentFee");

const createFee = async (req, res) => {
  try {
    const { name, amount, isDefault } = req.body;

    if (isDefault) {
      await EnrollmentFee.updateMany({}, { isDefault: false });
    }

    const fee = await EnrollmentFee.create({ name, amount, isDefault });
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFees = async (req, res) => {
  try {
    const fees = await EnrollmentFee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFee = async (req, res) => {
  try {
    const fee = await EnrollmentFee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }
    res.json({ message: "Fee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createFee, getFees, deleteFee };