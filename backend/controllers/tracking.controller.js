const VideoLog = require('../models/VideoLog');
const Interest = require('../models/Interest');
// POST /api/tracking
const logVideoView = async (req, res) => {
  try {
    const { videoTitle, videoUrl, timeSpent } = req.body;

    if (!videoTitle || !videoUrl) {
      return res.status(400).json({ message: 'Video title and URL are required' });
    }

    const newLog = new VideoLog({
      user: req.user,
      videoTitle,
      videoUrl,
      timeSpent: timeSpent || 0,
    });

    await newLog.save();

    res.status(201).json({ message: 'Video log saved', log: newLog });
  } catch (err) {
    console.error('Error logging video view:', err);
    res.status(500).json({ message: 'Server error while saving video log' });
  }
};

// Dummy controller implementations
const getAllTrackedVideos = async (req, res) => {
    try{
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const logs = await VideoLog.find({ user: userId }).sort({ clickedAt: -1 });
        if (!logs.length) {
            return res.status(404).json({ message: 'No video logs found for this user' });
        }
        res.status(200).json({ logs });

    }
    catch(error){
        console.error('Error fetching tracked videos:', error);
        res.status(500).json({ message: 'Server error while fetching tracked videos' });
    }
};


const getSummaryStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const logs = await VideoLog.find({ user: userId });

    if (!logs.length) {
      return res.status(404).json({ message: 'No video logs found for this user' });
    }

    const totalWatchTime = logs.reduce((acc, log) => acc + log.timeSpent, 0);
    const totalVideos = logs.length;
    const averageTimePerVideo = Math.round(totalWatchTime / totalVideos);

    // Sort by clickedAt to get first and last watch
    const sortedLogs = [...logs].sort((a, b) => a.clickedAt - b.clickedAt);
    const firstWatched = sortedLogs[0]?.clickedAt;
    const lastWatched = sortedLogs[sortedLogs.length - 1]?.clickedAt;

    // Frequency of each video title
    const titleCount = {};
    logs.forEach(log => {
      titleCount[log.videoTitle] = (titleCount[log.videoTitle] || 0) + 1;
    });

    const topTitles = Object.entries(titleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([title, count]) => ({ title, count }));

    res.status(200).json({
      totalWatchTime,
      totalVideos,
      averageTimePerVideo,
      firstWatched,
      lastWatched,
      topTitles
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    res.status(500).json({ message: 'Server error while fetching summary stats' });
  }
};


const getDailyStats = async (req, res) => {
  res.json({ message: 'Dummy: getDailyStats controller hit' });
};

const getLearningProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const interestDoc = await Interest.findOne({ user: userId });
    const videoLogs = await VideoLog.find({ user: userId });

    if (!interestDoc || interestDoc.interests.length === 0) {
      return res.status(404).json({ message: 'No interests found for user' });
    }

    const result = interestDoc.interests.map((interest) => {
      const matchingVideos = videoLogs.filter((log) =>
        log.videoTitle.toLowerCase().includes(interest.toLowerCase())
      );

      return {
        interest,
        completed: matchingVideos.length > 0,
        relatedVideos: matchingVideos.map((v) => ({
          videoTitle: v.videoTitle,
          timeSpent: v.timeSpent,
        })),
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error computing learning progress:', error);
    res.status(500).json({ message: 'Server error while calculating learning progress' });
  }
};

const deleteLog = async (req, res) => {
  try {
    const logId = req.params.logId;

    if (!logId) {
      return res.status(400).json({ message: 'Log ID is required' });
    }

    const deleted = await VideoLog.findByIdAndDelete(logId);

    if (!deleted) {
      return res.status(404).json({ message: 'Video log not found or already deleted' });
    }

    res.status(200).json({ message: 'Video log deleted successfully', deleted });
  } catch (error) {
    console.error('Error deleting video log:', error);
    res.status(500).json({ message: 'Server error while deleting video log' });
  }
};

module.exports = {
  logVideoView,
  getAllTrackedVideos,
  getSummaryStats,
  getDailyStats,
  getLearningProgress,
  deleteLog,
};
