const express = require("express");
const router = express.Router();
const { createBatch, getBatches } = require("../controllers/batchController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createBatch);
router.get("/", protect, getBatches);

module.exports = router;