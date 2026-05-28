const express = require('express');
const { register, login, createLandlord, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/users", authMiddleware, allowRoles('admin'), getAllUsers);
router.post('/create-landlord', authMiddleware, allowRoles('admin'), createLandlord);

module.exports = router;
