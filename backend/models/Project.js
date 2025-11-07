const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: {
    type: String,
    enum: ['not started', 'in progress', 'completed'], // allowed values
    default: 'not started', // must match exactly
  },
});

module.exports = mongoose.model('Project', projectSchema);
