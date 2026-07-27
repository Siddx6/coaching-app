const express = require("express");
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require("../controllers/noticeController");
const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

router.post("/", protect, authorize(["admin"]), createNotice);
router.get("/", protect, getNotices);
router.delete("/:id", protect, authorize(["admin"]), deleteNotice);

module.exports = router;