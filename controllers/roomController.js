const DeletedRoom = require('../models/DeletedRoom');
const Room = require('../models/Room');
const { ROOM_STATUSES } = require('../models/Room');

const normalizeStatus = (status) => {
  const value = String(status || '').toLowerCase();

  if (value === ROOM_STATUSES.APPROVED) {
    return ROOM_STATUSES.ACCEPTED;
  }

  return value;
};

const roomPopulate = [
  { path: 'createdBy', select: 'name email phone location role' },
  { path: 'approvedBy', select: 'name email role' },
];

exports.createRoom = async (req, res) => {
  try {
    const {
      title,
      rent,
      state,
      city,
      houseNo,
      location,
      image,
      roomType,
      userMobile,
      ownerName,
      ownerMobile,
    } = req.body;

    if (!title || !rent || !location || !userMobile || !ownerName || !ownerMobile) {
      return res.status(400).json({ message: 'Please fill all required room details' });
    }

    const room = await Room.create({
      title,
      rent,
      state,
      city,
      houseNo,
      location,
      image,
      roomType,
      userMobile,
      ownerName,
      ownerMobile,
      createdBy: req.user._id,
      status: ROOM_STATUSES.PENDING,
    });

    res.status(201).json({
      message: 'Room submitted for approval',
      room,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to add room', error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .populate(roomPopulate);

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load rooms', error: error.message });
  }
};

exports.getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate(roomPopulate);

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load your rooms', error: error.message });
  }
};

exports.getApprovedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: { $in: [ROOM_STATUSES.ACCEPTED, ROOM_STATUSES.APPROVED] },
      isOccupied: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .populate(roomPopulate);

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load approved rooms', error: error.message });
  }
};

exports.updateRoomStatus = async (req, res) => {
  try {
    const nextStatus = normalizeStatus(req.body?.status);

    if (![ROOM_STATUSES.ACCEPTED, ROOM_STATUSES.REJECTED, ROOM_STATUSES.BOOKED].includes(nextStatus)) {
      return res.status(400).json({
        message: 'status must be accepted, rejected, or booked',
      });
    }

    const updateData = { status: nextStatus };

    if (nextStatus === ROOM_STATUSES.ACCEPTED) {
      updateData.approvedBy = req.user._id;
      updateData.approvedAt = new Date();
      updateData.isOccupied = false;
    }

    if (nextStatus === ROOM_STATUSES.REJECTED) {
      updateData.rejectedAt = new Date();
      updateData.isOccupied = false;
    }

    if (nextStatus === ROOM_STATUSES.BOOKED) {
      updateData.isOccupied = true;
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate(roomPopulate);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      message: `Room ${nextStatus} successfully`,
      room,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update room status', error: error.message });
  }
};

exports.markRoomOccupied = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { isOccupied: true, status: ROOM_STATUSES.BOOKED },
      { new: true },
    ).populate(roomPopulate);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room marked as booked', room });
  } catch (error) {
    res.status(500).json({ message: 'Unable to mark room booked', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await DeletedRoom.create({
      originalRoomId: room._id,
      title: room.title,
      rent: room.rent,
      state: room.state,
      city: room.city,
      houseNo: room.houseNo,
      roomType: room.roomType,
      location: room.location,
      image: room.image,
      userMobile: room.userMobile,
      ownerName: room.ownerName,
      ownerMobile: room.ownerMobile,
      status: room.status,
      addedBy: room.createdBy,
      deletedBy: req.user._id,
      roomCreatedAt: room.createdAt,
    });

    await room.deleteOne();

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete room', error: error.message });
  }
};

exports.getDeletedRooms = async (req, res) => {
  try {
    const deletedRooms = await DeletedRoom.find()
      .sort({ createdAt: -1 })
      .populate('addedBy', 'name email role')
      .populate('deletedBy', 'name email role');

    res.json({ deletedRooms });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load deleted rooms', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalCount, pendingCount, acceptedCount, rejectedCount] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: ROOM_STATUSES.PENDING }),
      Room.countDocuments({ status: { $in: [ROOM_STATUSES.ACCEPTED, ROOM_STATUSES.APPROVED] } }),
      Room.countDocuments({ status: ROOM_STATUSES.REJECTED }),
    ]);

    res.json({
      totalCount,
      pendingCount,
      acceptedCount,
      rejectedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load stats', error: error.message });
  }
};
