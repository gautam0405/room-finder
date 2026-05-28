const express = require('express');

const {
  createRoom,
  getRooms,
  getMyRooms,
  updateRoomStatus,
  deleteRoom,
  getDeletedRooms,
  getApprovedRooms,
  markRoomOccupied
} = require('../controllers/roomController');

const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// ================= USER =================

// ➕ Add room (only user)
router.post(
  '/',
  authMiddleware,
  allowRoles('user'),
  createRoom
);

// 📄 My rooms
router.get(
  '/mine',
  authMiddleware,
  allowRoles('user'),
  getMyRooms
);

// 🔍 Search (approved only)
router.get(
  '/approved',
  getApprovedRooms
);


// ================= EMPLOYEE + ADMIN =================

// 📋 All rooms (for verification)
router.get(
  '/',
  authMiddleware,
  allowRoles('admin', 'employee'),
  getRooms
);

// ✅ Approve / Reject
router.put(
  '/:id/status',
  authMiddleware,
  allowRoles('admin', 'employee'),
  updateRoomStatus
);

router.put(
  '/:id',
  authMiddleware,
  allowRoles('admin', 'employee'),
  updateRoomStatus
);


// ================= ADMIN =================

// 🗑 Delete room
router.delete(
  '/:id',
  authMiddleware,
  allowRoles('admin'),
  deleteRoom
);

// 📦 Deleted rooms
router.get(
  '/deleted',
  authMiddleware,
  allowRoles('admin'),
  getDeletedRooms
);


// ================= EXTRA =================

// 🏠 Mark room occupied
router.put(
  '/:id/occupied',
  authMiddleware,
  allowRoles('admin', 'employee'),
  markRoomOccupied
);

module.exports = router;
