const express = require("express");
const router = express.Router();
const { createSubCourse, getSubCourses, updateSubCourse, deleteSubCourse } = require("../controllers/subCourseController");const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createSubCourse);
router.get("/", protect, getSubCourses);
router.patch("/:id", protect, authorize(["admin"]), updateSubCourse);
router.delete("/:id", protect, authorize(["admin"]), deleteSubCourse);

module.exports = router;