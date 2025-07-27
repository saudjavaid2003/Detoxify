const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth.middleware');

const {
  addUserInterest,
  getUserInterest,
  updateUserInterest,
  deleteUserInterest
} = require('../controllers/user.controller');

// 1. Add or update interests
router.post('/interests', protect, addUserInterest);

// 2. Get interests of logged-in user
router.get('/interests', protect, getUserInterest);

// 3. Update interests
router.put('/interests', protect, updateUserInterest);

// 4. Delete interests
router.delete('/interests', protect, deleteUserInterest);

module.exports = router;
