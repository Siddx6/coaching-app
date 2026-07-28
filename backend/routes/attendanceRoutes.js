const express = require("express");
const router = express.Router();
const { markAttendance, getAttendance, getMyAttendance } = require("../controllers/attendanceController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const protectStudent = require("../middleware/studentAuth");

router.post("/", protect, authorize(["admin", "operator"]), markAttendance);
router.get("/", protect, authorize(["admin", "operator"]), getAttendance);
router.get("/my", protectStudent, getMyAttendance);

module.exports = router;