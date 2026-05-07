const allowRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized: user not logged in',
      });
    }

    // 🔥 keep roles as-is (lowercase)
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
};


// ✅ Shortcuts
allowRoles.requireAdmin = allowRoles('admin');

allowRoles.requireAdminOrEmployee = allowRoles('admin', 'employee');

allowRoles.requireAuthenticatedUser = allowRoles('admin', 'employee', 'user');


module.exports = allowRoles;