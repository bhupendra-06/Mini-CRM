const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Create Lead
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all leads
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

// Update Lead
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lead);
});

// Delete Lead
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: 'Lead deleted' });
});


module.exports = router;
