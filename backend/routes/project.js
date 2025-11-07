const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Create Project
router.post("/", verifyToken, verifyRole(["admin"]), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all projects (Admin: all, Staff: assigned, Client: own)
router.get("/", verifyToken, async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      // Admin → can see all projects
      projects = await Project.find().populate("client staff");
    } else if (req.user.role === "staff") {
      //  Staff → can see only projects assigned to them
      projects = await Project.find({ staff: req.user.id }).populate(
        "client staff"
      );
    } else if (req.user.role === "client") {
      //  Client → can see only their own projects
      projects = await Project.find({ client: req.user.id }).populate(
        "client staff"
      );
    } else {
      //  Others (like leads)
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Project status
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "staff"]),
  async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(project);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Delete project
router.delete("/:id", verifyToken, verifyRole(["admin"]), async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project deleted" });
});

// Filter projects by status, client, staff
router.get("/filter", verifyToken, async (req, res) => {
  try {
    const { status, client, staff } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = client;
    if (staff) filter.staff = staff;

    const projects = await Project.find(filter).populate("client staff");
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
