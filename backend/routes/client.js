const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Convert Lead → Client
router.post('/convert/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json('Lead not found');

    const client = await Client.create({
      name: lead.name,
      email: lead.email,
      contact: lead.contact
    });

    await Lead.findByIdAndDelete(req.params.id); // remove lead after conversion
    res.json({ message: 'Lead converted to client', client });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all clients
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const clients = await Client.find().populate('projects');
  res.json(clients);
});

// Update client
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient) return res.status(404).json('Client not found');
    res.json(updatedClient);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete client
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json('Client not found');
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
