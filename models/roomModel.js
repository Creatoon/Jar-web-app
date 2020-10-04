const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room must have a name'],
      trim: true,
      maxlength: [40, 'A room name must not exceed 40 characters'],
      minlength: [3, 'A room name should be greater than 3 characters']
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now()
    },
    roomImage: {
      type: String,
      default: 'default.png'
    },
    roomDescription: {
      type: String,
      trim: true,
      required: [true, 'A room must have a description']
    },
    password: {
      type: String,
      minlength: [
        8,
        'A password should be greater than or equal to eight characters'
      ],
      select: false
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

roomSchema.virtual('members', {
  ref: 'Proposal',
  foreignField: 'room',
  localField: '_id'
});

roomSchema.virtual('allChats', {
  ref: 'Message',
  foreignField: 'room',
  localField: '_id'
});

roomSchema.pre('save', async function(next) {
  if (this.password === process.env.SECURE_ROOM_PASSWORD) return next();
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

// Using slugify to create slugs
roomSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// transforming all room names to lowercase
roomSchema.pre('save', function(next) {
  this.name = this.name.toLowerCase();
  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
