const User = require('../models/User');

// Get all staff users
const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({ role: 'staff' }).select('-password'); // exclude password
    res.json(staffUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStaffUsers };
