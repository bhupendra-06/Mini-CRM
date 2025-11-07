const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Convert Lead → Client
// router.post('/convert/:email', verifyToken, verifyRole(['admin']), async (req, res) => {
//   try {
//     // Find lead by email
//     const lead = await Lead.findOne({ email: req.params.email });
//     if (!lead) return res.status(404).json('Lead not found');

//     // Create a new client from lead data
//     const client = await Client.create({
//       name: lead.name,
//       email: lead.email,
//       contact: lead.contact,
//       password: lead.password,
//     });

//     // Update the user's role in User collection
//     const updatedUser = await User.findOneAndUpdate(
//       { email: lead.email },
//       { role: 'client' },
//       { new: true }
//     );

//     // Remove lead after conversion
//     await Lead.findOneAndDelete({ email: lead.email });

//     res.json({
//       message: 'Lead converted to client successfully',
//       client,
//       updatedUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Conversion failed', error: err.message });
//   }
// });
router.post('/convert/:email', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    console.log("👉 Conversion started for:", email);

    // Step 1 — Find the lead
    const lead = await Lead.findOne({ email: email });
    if (!lead) {
      console.log("❌ Lead not found in DB for email:", email);
      return res.status(404).json('Lead not found');
    }
    console.log("✅ Lead found:", lead.email);

    // Step 2 — Create client
    const client = await Client.create({
      name: lead.name,
      email: lead.email,
      contact: lead.contact,
      password: lead.password,
    });
    console.log("✅ Client created:", client.email);

    // Step 3 — Update user role
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { role: 'client' },
      { new: true }
    );
    if (!updatedUser) {
      console.log("⚠️ No user found to update for email:", email);
    } else {
      console.log("✅ User updated:", updatedUser.email, "role:", updatedUser.role);
    }

    // Step 4 — Delete lead
    const deleteResult = await Lead.deleteOne({ email: email });
    console.log("🗑️ Lead delete result:", deleteResult);

    res.json({
      message: 'Lead converted to client successfully',
      client,
      updatedUser,
      deleteResult,
    });
  } catch (err) {
    console.error("❌ Conversion failed:", err);
    res.status(500).json({ message: 'Conversion failed', error: err.message });
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
