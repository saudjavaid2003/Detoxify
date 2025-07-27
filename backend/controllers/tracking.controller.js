const VideoLog = require('../models/VideoLog');
// const interests = require('../utils/interests'); //
//  Assuming you have a utility to handle interests
const Interest=require("../models/Interest");


const VideoLog = require('../models/VideoLog');

// POST /api/tracking
// Save a video click and time spent
const logVideoView = async (req, res) => {
  try {
    const { videoTitle, videoUrl, timeSpent } = req.body;

    if (!videoTitle || !videoUrl) {
      return res.status(400).json({ message: 'Video title and URL are required' });
    }

    const newLog = new VideoLog({
      user: req.user, // comes from protect middleware
      videoTitle,
      videoUrl,
      timeSpent: timeSpent || 0
    });

    await newLog.save();

    res.status(201).json({ message: 'Video log saved', log: newLog });
  } catch (err) {
    console.error('Error logging video view:', err);
    res.status(500).json({ message: 'Server error while saving video log' });
  }
};

module.exports = {
  logVideoView
};
