const User = require('../models/User');

const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({ role: 'staff' }).select('-password');
    res.json(staffUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStaffUsers };
