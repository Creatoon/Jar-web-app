const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Room = require('./../models/roomModel');
const AppError = require('./../utils/appError');

const proposalSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      default: process.env.SECURE_ROOM_PASSWORD,
      required: [true, 'you must have to the password']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'proposal can not be done without user ']
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      required: [true, 'proposal can not be done without room ']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

proposalSchema.index(
  {
    room: 1,
    user: 1
  },
  {
    unique: true
  }
);

proposalSchema.pre('save', async function(next) {
  if (this.password === process.env.SECURE_ROOM_PASSWORD) return next();
  if (!this.password) return next();

  const origRoom = await Room.findById(this.room).select('+password');
  const origRoomPass = origRoom.password;

  if (!origRoom || !(await bcrypt.compare(this.password, origRoomPass))) {
    return next(new AppError('Sorry Wrong password', 401));
  }

  next();
});

proposalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 13);
  next();
});

proposalSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'photo name'
  }).populate({
    path: 'room',
    select: 'roomImage name'
  });
  next();
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
