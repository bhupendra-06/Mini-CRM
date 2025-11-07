const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/auth");
const { getStaffUsers, getClientUsers } = require('../controllers/userController');


// Get all staff users (admin only)
router.get("/staff", verifyToken, verifyRole(["admin"]), getStaffUsers);
router.get("/clients", verifyToken, verifyRole(["admin"]), getClientUsers);

module.exports = router;