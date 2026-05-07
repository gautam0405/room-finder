const express = require('express');

const {
  register,
  login,
  createEmployee,
  getEmployees,
  getAllUsers,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// 🔓 Public routes
router.post('/register', register);
router.post('/login', login);

// 🔐 Admin routes
router.get('/users', authMiddleware, allowRoles('admin'), getAllUsers);

router.post(
  '/create-employee',
  authMiddleware,
  allowRoles('admin'),
  createEmployee
);

router.get(
  '/employees',
  authMiddleware,
  allowRoles('admin'),
  getEmployees
);

module.exports = router;