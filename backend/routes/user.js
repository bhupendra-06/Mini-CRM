const express = require('express');
const router = express.Router();
const { getStaffUsers } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/auth'); // if you want auth

// Route to get all staff users
router.get('/staff', verifyToken, verifyRole(['admin']), getStaffUsers);

module.exports = router;
