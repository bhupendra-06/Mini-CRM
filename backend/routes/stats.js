const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const clientsCount = await Client.countDocuments();
    const leadsCount = await Lead.countDocuments();
    const projectsCount = await Project.countDocuments();
    const staffCount = await User.countDocuments({ role: 'staff' });

    res.json({
      clients: clientsCount,
      leads: leadsCount,
      projects: projectsCount,
      staff: staffCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
