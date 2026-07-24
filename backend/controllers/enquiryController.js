const Enquiry = require("../models/Enquiry");

const createEnquiry = async (req, res) => {
  try {
    const { name, mobile, courseInterest, source, followUpDate } = req.body;
    const enquiry = await Enquiry.create({ name, mobile, courseInterest, source, followUpDate });
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEnquiry, getEnquiries, updateEnquiry };