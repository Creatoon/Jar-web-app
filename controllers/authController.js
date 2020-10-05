const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

 if (req.secure || req.headers('x-forwarded-proto') === 'https') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  createAndSendToken(newUser, 200, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  // getting the details from user
  const { email, password } = req.body;
  // checking if both of the email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // check if the user exists and password is incorrect
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok , send token to client
  createAndSendToken(user, 201, res);
});

exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggeedot', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting token

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // checking if the token exists or not
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // checking if the token is correct or not

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // checking if the user stilll exists

  const freshUser = await User.findById(decoded.id).populate({
    path: 'roomsJoined',
    select: '-__v'
  });

  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists',
        401
      )
    );
  }

  // checking if the user has changed its password

  if (freshUser.changedPasswordAt(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed its password! please login again',
        401
      )
    );
  }

  // Grant Access To Protected ROute
  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // check the user
  const user = await await User.findById(req.user.id).select('+password');

  // check if the current password is same to database password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Current password provided is not correct', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4) Log user in, send JWT
  createAndSendToken(user, 201, res);
});

// Only for rendered pages
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  try {
    if (req.cookies.jwt) {
      // 2) Verification token

      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exists
      const freshUser = await User.findById(decoded.id).populate({
        path: 'roomsJoined',
        select: '-__v'
      });

      if (!freshUser) {
        return next();
      }

      // 4) Check if the user is changed its password or not

      if (freshUser.changedPasswordAt(decoded.iat)) {
        return next();
      }

      // There is an logged in user
      // res.locals will put this user in every pug templates

      res.locals.user = freshUser;

      return next();
    }
  } catch (err) {
    return next();
  }

  next();
});

// Checker middleware for giving access to protected rooms

exports.checkValidUser = (req, res, next) => {
  const userId = res.locals.user.id;
  const roomMembers = res.locals.roomCame.members;

  let validator;

  roomMembers.forEach(el => {
    if (el.user.id === userId) validator = userId;
  });

  if (!validator) {
    return next(new AppError("You havn't joined this room yet!", 400));
  }

  next();
};
