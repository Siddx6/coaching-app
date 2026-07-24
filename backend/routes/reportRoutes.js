const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/reportController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.get("/dashboard", protect, authorize(["admin", "operator"]), getDashboard);

module.exports = router;