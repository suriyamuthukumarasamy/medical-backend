const jwt = require('jsonwebtoken');
const User = require('../../customer/models/user.model');

//  Middleware to protect routes (requires token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //  Extract token
      token = req.headers.authorization.split(' ')[1];

      //  Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user and attach to req (without password)
      req.user = await User.findById(decoded.userId).select('-password');

      return next(); // Allow request
    } catch (error) {
      console.error('❌ Error in protect middleware:', error.message);
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  //  No token found
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }
};

//  Middleware to allow only admin users
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: 'Access denied. Admins only.' });
  }
};

//  Export both
module.exports = {
  protect,
  isAdmin,
};
