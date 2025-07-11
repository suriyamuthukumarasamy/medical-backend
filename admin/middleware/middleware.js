const jwt = require('jsonwebtoken');
const User = require('../../customer/models/user.model');

// Protect Middleware
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ success: false, message: 'No token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Either decoded.id or decoded.userId based on your token creation
    req.user = await User.findById(decoded.id || decoded.userId).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Admin Check
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();

  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.',
  });
};

module.exports = { protect, isAdmin };
