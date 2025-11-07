const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/auth");
const { getStaffUsers } = require("../controllers/userController");

// Get all staff users (admin only)
router.get("/staff", verifyToken, verifyRole(["admin"]), getStaffUsers);

module.exports = router;
