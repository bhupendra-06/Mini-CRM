const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  assignedStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Client', clientSchema);
