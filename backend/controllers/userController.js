const User = require('../models/User');

const getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({ role: 'staff' }).select('-password');
    res.json(staffUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClientUsers = async (req, res) => {
  try {
    const clientUsers = await User.find({ role: 'client' }).select('-password');
    res.json(clientUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStaffUsers, getClientUsers };
