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

// Update staff details (name, email, etc.)
const updateStaffUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Only allow updates for staff role
    const user = await User.findOneAndUpdate(
      { _id: id, role: 'staff' },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Staff not found' });

    res.json({ message: 'Staff updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a staff
const deleteStaffUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findOneAndDelete({ _id: id, role: 'staff' });

    if (!deleted) return res.status(404).json({ message: 'Staff not found' });

    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStaffUsers,
  getClientUsers,
  updateStaffUser,
  deleteStaffUser,
};