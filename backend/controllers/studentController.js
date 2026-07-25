const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const body = req.body;

    let photoUrl = "";
    let documents = [];

    if (req.files) {
      if (req.files.photo && req.files.photo[0]) {
        photoUrl = req.files.photo[0].path;
      }
      if (req.files.documents) {
        documents = req.files.documents.map((doc) => doc.path);
      }
    }

    const student = await Student.create({
      ...body,
      photoUrl,
      documents,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("batch").sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStudent, getStudents, deleteStudent };