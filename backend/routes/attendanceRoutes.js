const express = require("express");
const router = express.Router();
const { markAttendance, getAttendance } = require("../controllers/attendanceController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin", "operator"]), markAttendance);
router.get("/", protect, authorize(["admin", "operator"]), getAttendance);

module.exports = router;