const User = require('../models/User');
const Interest = require('../models/Interest');

// @desc    Add or update user interests
const addUserInterest = async (req, res) => {
  const { interests } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let userInterest = await Interest.findOne({ user: user._id });

    if (userInterest) {
      userInterest.interests = interests;
      userInterest.updatedAt = Date.now();
      await userInterest.save();
      return res.status(200).json({ message: 'Interests updated', interests: userInterest });
    }

    const newInterests = await Interest.create({
      user: user._id,
      interests
    });

    return res.status(201).json({ message: 'Interests added successfully', interests: newInterests });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user interests
const getUserInterest = async (req, res) => {
  const userId = req.user.id;

  try {
    const userInterest = await Interest.findOne({ user: userId });

    if (!userInterest) {
      return res.status(404).json({ message: 'User interests not found' });
    }

    return res.status(200).json({ interests: userInterest.interests });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user interests
const updateUserInterest = async (req, res) => {
  const userId = req.user.id;
  const { interests } = req.body;

  try {
    if (!interests) {
      return res.status(400).json({ message: 'Interests are required' });
    }

    const userInterest = await Interest.findOne({ user: userId });

    if (!userInterest) {
      return res.status(404).json({ message: 'User interests not found' });
    }

    userInterest.interests = interests;
    userInterest.updatedAt = Date.now();
    await userInterest.save();

    return res.status(200).json({ message: 'Interests updated successfully', interests: userInterest.interests });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while updating interests' });
  }
};

// @desc    Delete user interests
const deleteUserInterest = async (req, res) => {
  const userId = req.user.id;

  try {
    const userInterest = await Interest.findOneAndDelete({ user: userId });

    if (!userInterest) {
      return res.status(404).json({ message: 'User interests not found' });
    }

    return res.status(200).json({ message: 'User interests deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addUserInterest,
  getUserInterest,
  updateUserInterest,
  deleteUserInterest
};
