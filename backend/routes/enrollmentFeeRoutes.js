const express = require("express");
const router = express.Router();
const { createFee, getFees, deleteFee } = require("../controllers/enrollmentFeeController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createFee);
router.get("/", protect, getFees);
router.delete("/:id", protect, authorize(["admin"]), deleteFee);

module.exports = router;