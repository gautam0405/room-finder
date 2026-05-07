const express = require('express');

const { getStats } = require('../controllers/roomController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// 📊 Stats (Admin + Employee)
router.get(
  '/stats',
  authMiddleware,
  allowRoles('admin', 'employee'),
  getStats
);

module.exports = router;