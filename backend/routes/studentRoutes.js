const express = require("express");
const router = express.Router();
const { createStudent, getStudents } = require("../controllers/studentController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");
const upload = require("../middleware/upload");

router.post(
  "/",
  protect,
  authorize(["admin", "operator"]),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  createStudent
);

router.get("/", protect, authorize(["admin", "operator"]), getStudents);

module.exports = router;