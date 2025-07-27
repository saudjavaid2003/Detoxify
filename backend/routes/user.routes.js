const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const {
  logVideoView,
  getAllTrackedVideos,
  getSummaryStats,
  getDailyStats,
  getLearningProgress,
  getTopTopics,
  getUnrelatedVideos,
  deleteLog
} = require('../controllers/tracking.controller');

// 1. Log a video view
router.post('/', protect, logVideoView);

// 2. Get all tracked videos for user
router.get('/', protect, getAllTrackedVideos);

// 3. Get total time & stats summary
router.get('/summary', protect, getSummaryStats);

// 4. Get daily watch stats
router.get('/daily', protect, getDailyStats);

// 5. Get progress: match todos with videos
router.get('/progress', protect, getLearningProgress);

// 6. Get top topics by frequency
router.get('/top-topics', protect, getTopTopics);

// 7. Get unrelated videos (not matching interests)
router.get('/unrelated', protect, getUnrelatedVideos);

// 8. Delete a specific log
router.delete('/:logId', protect, deleteLog);

module.exports = router;
