const express = require("express");
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiry } = require("../controllers/enquiryController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin", "operator"]), createEnquiry);
router.get("/", protect, authorize(["admin", "operator"]), getEnquiries);
router.patch("/:id", protect, authorize(["admin", "operator"]), updateEnquiry);

module.exports = router;