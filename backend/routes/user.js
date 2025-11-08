const express = require('express');
const router = express.Router();
const {
  getStaffUsers,
  getClientUsers,
  updateStaffUser,
  deleteStaffUser,
} = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Get all staff
router.get('/staff', verifyToken, verifyRole(['admin']), getStaffUsers);

// Get all clients
router.get('/clients', verifyToken, verifyRole(['admin']), getClientUsers);

// Update staff
router.put('/staff/:id', verifyToken, verifyRole(['admin']), updateStaffUser);

// Delete staff
router.delete('/staff/:id', verifyToken, verifyRole(['admin']), deleteStaffUser);

module.exports = router;
