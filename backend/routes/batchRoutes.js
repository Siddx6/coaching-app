const express = require("express");
const router = express.Router();
const { createBatch, getBatches, updateBatch, deleteBatch } = require("../controllers/batchController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createBatch);
router.get("/", protect, getBatches);
router.patch("/:id", protect, authorize(["admin"]), updateBatch);
router.delete("/:id", protect, authorize(["admin"]), deleteBatch);

module.exports = router;