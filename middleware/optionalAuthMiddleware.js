const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const normalizeRole = (role) => String(role || '').toUpperCase();

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next();
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: normalizeRole(user.role),
    };

    return next();
  } catch (error) {
    // Intentionally ignore optional-auth failures so guest flow still works.
    return next();
  }
};

module.exports = optionalAuthMiddleware;
