const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  deadline: Date,
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  progress: {
    type: String,
    enum: ['not started', 'in progress', 'completed'], 
    default: 'not started',
  },
});

module.exports = mongoose.model('Project', projectSchema);
