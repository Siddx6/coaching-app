const Attendance = require("../models/Attendance");

const markAttendance = async (req, res) => {
  try {
    const { student, batch, date, status } = req.body;

    const record = await Attendance.findOneAndUpdate(
      { student, batch, date },
      { student, batch, date, status },
      { upsert: true, returnDocument: "after" }
    );

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { batchId, date } = req.query;
    const filter = {};
    if (batchId) filter.batch = batchId;
    if (date) filter.date = date;

    const records = await Attendance.find(filter).populate("student", "name memberId");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { markAttendance, getAttendance };