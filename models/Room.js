const mongoose = require('mongoose');

const ROOM_STATUSES = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  BOOKED: 'booked',
});

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    rent: {
      type: Number,
      required: true,
      min: 1,
    },

    state: { type: String, trim: true },
    city: { type: String, trim: true },
    houseNo: { type: String, trim: true },

    roomType: {
      type: String,
      enum: ['single', 'double', '1bhk', '2bhk', '3bhk'],
    },

    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    image: {
      type: String,
      default: '',
    },

    userMobile: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    ownerMobile: {
      type: String,
      required: true,
    },

    // 🔥 STATUS SYSTEM
    status: {
      type: String,
      enum: Object.values(ROOM_STATUSES),
      default: ROOM_STATUSES.PENDING,
    },

    // 🔥 USER WHO CREATED
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🔥 EMPLOYEE WHO APPROVED
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // 🔥 ROOM OCCUPIED / FILLED
    isOccupied: {
      type: Boolean,
      default: false,
    },

    // 🔥 TRACK ACTION TIME
    approvedAt: Date,
    rejectedAt: Date,
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
module.exports.ROOM_STATUSES = ROOM_STATUSES;
