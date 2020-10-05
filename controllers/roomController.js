const aws = require('aws-sdk');
const multer = require('multer');
const sharpMulters3 = require('multer-sharp-s3');
//const multerS3 = require('multer-s3');
//const sharp = require('sharp');
const AppError = require('../utils/appError');
//const catchAsync = require('../utils/catchAsync');
const Room = require('./../models/roomModel');
const factory = require('./handlerFactory');

aws.config.update({
  secretAccessKey: process.env.SecretAccessKey,
  accessKeyId: process.env.AccessKeyID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const upload = multer({
  storage: sharpMulters3({
    key: function(req, file, cb) {
      cb(null, `room-${req.user.id}-${Date.now()}.jpeg`);
    },
    s3: s3,
    Bucket: process.env.AWSBucketName,
    acl: 'public-read',
    resize: { width: 150, height: 150 },
    max: true,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: 'testing' });
    }
  })
});

exports.uploadRoomPhoto = upload.single('roomImage');

exports.getAllRooms = factory.getAll(Room);
exports.getOneRoomById = factory.getOne(Room, {
  path: 'members',
  select: '-__v  -createdAt -password'
});
exports.getRoomsByName = factory.getAllByNames(Room);
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);

exports.getRoomByIdForRendering = async (req, res, next) => {
  let rightParam;

  if (req.originalUrl.startsWith('/room')) {
    if (req.params.id.startsWith('5') && req.params.id.length === 24) {
      rightParam = req.params.id;
    } else {
      return next(new AppError('No route found with this room name', 400));
    }
  } else if (req.originalUrl.startsWith('/join')) {
    rightParam = req.params.roomid;
  }

  const query = await Room.findById(rightParam)
    .select('+password')
    .populate({
      path: 'members',
      select: '-__v  -createdAt -password'
    })
    .populate({
      path: 'allChats'
    });

  if (!query) {
    return next(new AppError('No room found with this Name or Id', 404));
  }

  res.roomID = query.id;
  res.locals.roomCame = query;

  next();
};
