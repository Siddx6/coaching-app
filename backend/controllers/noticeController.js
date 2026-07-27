const Notice = require("../models/Notice");

const createNotice = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    const notice = await Notice.create({ title, message, audience });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json({ message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotice, getNotices, deleteNotice };