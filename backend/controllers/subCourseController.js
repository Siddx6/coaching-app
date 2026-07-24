const SubCourse = require("../models/SubCourse");

const createSubCourse = async (req, res) => {
  try {
    const { course, name } = req.body;
    const subCourse = await SubCourse.create({ course, name });
    res.status(201).json(subCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubCourses = async (req, res) => {
  try {
    const subCourses = await SubCourse.find().populate("course").sort({ createdAt: -1 });
    res.json(subCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSubCourse, getSubCourses };