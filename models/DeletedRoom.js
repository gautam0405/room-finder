const mongoose = require('mongoose');

const deletedRoomSchema = new mongoose.Schema(
  {
    originalRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      default: '',
      trim: true,
    },
    houseNo: {
      type: String,
      default: '',
      trim: true,
    },
    roomType: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    userMobile: {
      type: String,
      default: '',
      trim: true,
    },
    ownerName: {
      type: String,
      default: '',
      trim: true,
    },
    ownerMobile: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: '',
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomCreatedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const DeletedRoom = mongoose.model('DeletedRoom', deletedRoomSchema);

module.exports = DeletedRoom;
