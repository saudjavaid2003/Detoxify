const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interests: [String],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interest', InterestSchema);
