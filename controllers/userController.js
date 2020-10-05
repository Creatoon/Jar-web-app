const aws = require('aws-sdk');
const multer = require('multer');
const sharpMulters3 = require('multer-sharp-s3');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

aws.config.update({
  secretAccessKey: process.env.SecretAccessKey,
  accessKeyId: process.env.AccessKeyID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const upload = multer({
  storage: sharpMulters3({
    key: function(req, file, cb) {
      cb(null, `user-${req.user.id}-${Date.now()}.jpeg`);
    },
    s3: s3,
    Bucket: process.env.AWSBucketName,
    acl: 'public-read',
    resize: { width: 400, height: 400 },
    max: true,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: 'userImage' });
    }
  })
});

exports.uploadUserPhoto = upload.single('photo');

exports.getAllUsers = factory.getAll(User);

// setting middleware before get me

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// user updates himself only
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) check if the user is not put the password on body
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) checking and filtering out the unwanyted details like "ROLES"
  if (req.file) {
    req.body.photo = req.file.Location;
  }

  // 3) updating the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  // 4) we have to send backm the updated response
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Me because it is deleted by the user
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead'
  });
};

exports.getUser = factory.getOne(User, {
  path: 'roomsJoined',
  select: '-__v  -createdAt -password'
});
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
