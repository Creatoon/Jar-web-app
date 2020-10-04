const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room'
    },
    userName: {
      type: String,
      default: 'anonymous'
    }
  },
  {
    toJSON: { ObjectId: true },
    toObject: { ObjectId: true },
    timestamps: true
  }
);

messageSchema.index({
  message: 1
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
