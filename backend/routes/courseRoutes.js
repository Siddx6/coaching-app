const express = require("express");
const router = express.Router();
const { createCourse, getCourses, updateCourse, deleteCourse } = require("../controllers/courseController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createCourse);
router.get("/", protect, getCourses);
router.patch("/:id", protect, authorize(["admin"]), updateCourse);
router.delete("/:id", protect, authorize(["admin"]), deleteCourse);

module.exports = router;