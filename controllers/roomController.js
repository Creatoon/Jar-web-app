const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Room = require('./../models/roomModel');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadRoomPhoto = upload.single('roomImage');

exports.resizeRoomPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `room-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/groups/${req.file.filename}`);

  next();
});

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
