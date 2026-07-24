const express = require("express");
const router = express.Router();
const { addPayment, getPaymentsByStudent } = require("../controllers/paymentController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin", "operator"]), addPayment);
router.get("/student/:studentId", protect, authorize(["admin", "operator"]), getPaymentsByStudent);

module.exports = router;