const Project = require("../models/Project");
const User = require("../models/User");

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, deadline, clientId, staffIds } = req.body;

    // Check client exists
    const client = await User.findById(clientId);
    if (!client || client.role !== "client") {
      return res.status(400).json({ message: "Invalid client selected" });
    }

    // Check staff exist
    const staffUsers = await User.find({ _id: { $in: staffIds }, role: "staff" });
    if (staffUsers.length !== staffIds.length) {
      return res.status(400).json({ message: "Invalid staff selected" });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      client: clientId,
      staff: staffIds,
      progress: "not started",
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Project creation failed", error: err.message });
  }
};

// Get projects based on role
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "admin") {
      // Admin sees all projects
      projects = await Project.find()
        .populate("client", "name email role") // get only necessary client fields
        .populate("staff", "name email role"); // get staff info
    } else if (req.user.role === "staff") {
      // Staff sees only projects assigned to them
      projects = await Project.find({ staff: req.user.id })
        .populate("client", "name email role")
        .populate("staff", "name email role");
    } else if (req.user.role === "client") {
      // Client sees only their projects
      projects = await Project.find({ client: req.user.id })
        .populate("client", "name email role")
        .populate("staff", "name email role");
    }

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.user.role === "staff") {
      if (!project.staff.includes(req.user.id)) return res.status(403).json({ message: "Not authorized" });
      project.progress = req.body.progress || project.progress;
    } else if (req.user.role === "admin") {
      Object.assign(project, req.body);
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (req.user.role === "staff" && !project.staff.includes(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
