const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the full user (you may remove `.select('-password')` if you want password too)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach user object to req
      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
};

module.exports = protect;
