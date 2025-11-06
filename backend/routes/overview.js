const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Client = require('../models/Client');
const Project = require('../models/Project');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalProjects = await Project.countDocuments();
    res.json({ totalLeads, totalClients, totalProjects });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
