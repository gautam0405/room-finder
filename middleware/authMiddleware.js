const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    // 🔒 Check token format
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Unauthorized: missing or invalid token',
      });
    }

    // 🔑 Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔥 FIX: use decoded.id (not userId)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized: user not found',
      });
    }

    // Attach user to request
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role // ✅ keep original (no uppercase)
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized: invalid or expired token',
    });
  }
};

module.exports = authMiddleware;