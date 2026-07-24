const express = require("express");
const router = express.Router();
const { addExpense, getExpenses } = require("../controllers/expenseController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), addExpense);
router.get("/", protect, authorize(["admin"]), getExpenses);

module.exports = router;