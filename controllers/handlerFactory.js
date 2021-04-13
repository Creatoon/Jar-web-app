const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find();

    if (docs.length === 0) {
      return next(new AppError('No document found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

exports.getAllByNames = Model =>
  catchAsync(async (req, res, next) => {
    const fin = new RegExp(`^${req.params.name}`);

    const filter = { name: { $in: [fin] } };

    const docs = await Model.find(filter);

    if (!docs) {
      return next(new AppError('No document found', 404));
    }

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

exports.getOne = (Model, popOptionsOne, popOptionsTwo) =>
  catchAsync(async (req, res, next) => {
    let query;

    console.log('entered0');

    if (popOptionsOne || popOptionsTwo) {
      query = await Model.findById(req.params.id)
        .populate(popOptionsOne)
        .populate(popOptionsTwo);
        console.log('entered1');
    } else {
      query = await Model.findById(req.params.id);
      console.log(query);
      console.log('entered2');
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.locals.roomCame = doc;

    res.status(200).json({
      status: 'success',
      data: {
        data: query
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    if (req.originalUrl.startsWith('/api/v1/rooms')) {
      Object.assign(req.body, { user: req.user.id });
    }

    if (req.originalUrl.startsWith('/api/v1/proposal')) {
      Object.assign(req.body, { user: req.user.id });
    }

    if (req.file) {
      req.body.roomImage = req.file.Location;
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndDelete(req.params.id);

    if (!docs) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
