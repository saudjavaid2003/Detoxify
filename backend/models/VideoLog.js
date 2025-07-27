const mongoose = require('mongoose');

const VideoLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoTitle: { type: String, required: true },
  videoUrl: { type: String, required: true },
  clickedAt: { type: Date, default: Date.now },
  timeSpent: { type: Number, default: 0 } // in seconds
});

module.exports = mongoose.model('VideoLog', VideoLogSchema);
