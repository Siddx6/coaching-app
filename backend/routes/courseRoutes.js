const express = require("express");
const router = express.Router();
const { createCourse, getCourses } = require("../controllers/courseController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createCourse);
router.get("/", protect, getCourses);

module.exports = router;