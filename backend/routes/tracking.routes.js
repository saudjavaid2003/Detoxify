const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');

const {
  logVideoView,
  getAllTrackedVideos,
  getSummaryStats,
  getDailyStats,
  getLearningProgress,
  deleteLog,
} = require('../controllers/trackingController');

// Save a video click & time spent
router.post('/', protect, logVideoView);

// All watched videos of a user
router.get('/:userId', getAllTrackedVideos);

// Summary: total time + video count
router.get('/summary/:userId', getSummaryStats);

// Daily trends: { date: seconds }
router.get('/daily/:userId', getDailyStats);

// Match interests with watched video titles
router.get('/progress/:userId', getLearningProgress);

// Delete a log entry (optional)
router.delete('/:logId', deleteLog);

module.exports = router;
