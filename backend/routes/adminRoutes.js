const express = require("express");
const router = express.Router();
const { getUsers, addUser, deleteUser } = require("../controllers/adminController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.get("/users", protect, authorize(["admin"]), getUsers);
router.post("/users", protect, authorize(["admin"]), addUser);
router.delete("/users/:id", protect, authorize(["admin"]), deleteUser);

module.exports = router;