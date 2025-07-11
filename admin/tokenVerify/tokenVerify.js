const jwt = require('jsonwebtoken');
const User = require('../../customer/models/user.model'); // Import your User model

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 FIXED HERE: use decoded.id not decoded.userId
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error('Error in protect middleware:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

module.exports = { protect };
