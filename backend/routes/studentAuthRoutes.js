const express = require("express");
const router = express.Router();
const { studentLogin, changeStudentPassword } = require("../controllers/studentAuthController");
const protectStudent = require("../middleware/studentAuth");

router.post("/login", studentLogin);
router.patch("/password", protectStudent, changeStudentPassword);

module.exports = router;