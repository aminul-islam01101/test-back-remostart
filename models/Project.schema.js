const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  budget: {
    type:String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
},
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
