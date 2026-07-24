const express = require("express");
const router = express.Router();
const { createSubCourse, getSubCourses } = require("../controllers/subCourseController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createSubCourse);
router.get("/", protect, getSubCourses);

module.exports = router;