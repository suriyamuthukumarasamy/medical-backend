

// Middleware to allow only admins
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { isAdmin };
