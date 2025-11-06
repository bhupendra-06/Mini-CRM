const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Create Project
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Project status
router.put('/:id', verifyToken, verifyRole(['admin', 'staff']), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all projects (Admin/Staff) or by client (Client)
router.get('/', verifyToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'client') {
      projects = await Project.find({ client: req.user.id }).populate('client staff');
    } else {
      projects = await Project.find().populate('client staff');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
