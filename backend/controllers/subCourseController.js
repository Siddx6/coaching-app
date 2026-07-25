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

const updateSubCourse = async (req, res) => {
  try {
    const subCourse = await SubCourse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subCourse) {
      return res.status(404).json({ message: "SubCourse not found" });
    }
    res.json(subCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSubCourse = async (req, res) => {
  try {
    const subCourse = await SubCourse.findByIdAndDelete(req.params.id);
    if (!subCourse) {
      return res.status(404).json({ message: "SubCourse not found" });
    }
    res.json({ message: "SubCourse deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createSubCourse, getSubCourses, updateSubCourse, deleteSubCourse };