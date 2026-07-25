const Course = require("../models/Course");

const createCourse = async (req, res) => {
  try {
    const { name } = req.body;
    const course = await Course.create({ name });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const SubCourse = require("../models/SubCourse");
    const Batch = require("../models/Batch");

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const subCourses = await SubCourse.find({ course: req.params.id });
    const subCourseIds = subCourses.map((sc) => sc._id);

    await Batch.deleteMany({ subCourse: { $in: subCourseIds } });
    await SubCourse.deleteMany({ course: req.params.id });
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course and all linked sub-courses/batches deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCourse, getCourses, updateCourse, deleteCourse };