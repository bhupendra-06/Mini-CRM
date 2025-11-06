const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  status: { type: String, default: 'Pending' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', projectSchema);
