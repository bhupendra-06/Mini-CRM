const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Lead = require("../models/Lead");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyRole } = require("../middleware/auth");

router.post(
  "/register",
  verifyToken,
  verifyRole(["admin", "staff"]),
  async (req, res) => {
    try {
      const { name, email, password, role, contact } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in User model
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Add to Lead or Client collection based on role
      if (role === "lead") {
        await Lead.create({
          name,
          email,
          contact: contact || "",
          password: hashedPassword,
        });
      }

      res.status(201).json({
        message: `${role} registered successfully`,
        user,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Registration failed", error: err.message });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid password");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

module.exports = router;
