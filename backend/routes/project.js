const express = require("express");
const router = express.Router();
const { createProject, getProjectsByUserId, getProjects, updateProject, deleteProject } = require("../controllers/projectController");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Admin can create project
router.post("/", verifyToken, verifyRole(["admin"]), createProject);

router.get("/user/:userId", verifyToken, getProjectsByUserId);

// Get projects (Admin: all, Staff: assigned, Client: own)
router.get("/", verifyToken, getProjects);

// Update project (Admin: all, Staff: assigned only)
router.put("/:id", verifyToken, updateProject);

// Delete project (Admin: all, Staff: assigned only)
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;
