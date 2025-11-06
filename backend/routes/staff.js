const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Create Staff
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'staff',
      contact
    });

    res.status(201).json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get all staff
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Staff
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    const staff = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'staff' },
      { name, email, contact },
      { new: true }
    );

    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    res.json(staff);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Staff
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const staff = await User.findOneAndDelete({ _id: req.params.id, role: 'staff' });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    res.json({ message: 'Staff deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
