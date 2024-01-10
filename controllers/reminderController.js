const mongoose = require('mongoose');
const Reminder = require('../models/reminderModel');
const catchAsync = require('../middlewares/catchAsync');
const fs = require('fs');
const path = require('path');

exports.getReminders = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 12;
  const skip = (page - 1) * limit;

  const filterData = {};

  const reminders = await Reminder.find(filterData).skip(skip).limit(limit).populate({
    path: 'category_id',
    select: '_id name',
  });

  const count = await Reminder.countDocuments(filterData);
  const totalPages = Math.ceil(count / limit);

  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Photo added';
    } else if (req.query.m === '2') {
      message = 'Photo deleted';
    }
  }

  res.status(200).json({
    title: 'Reminder',
    reminders,
    currentPage: page,
    page,
    limit,
    totalPages,
  });
});

exports.getReminder = catchAsync(async (req, res, next) => {
  const categories = await Category.find().sort({ order: 1 });
  let filterData = {
    _id: new mongoose.Types.ObjectId(req.params.id),
  };

  const setLimit = 12;
  const limit = req.query.limit * 1 || setLimit;
  const page = req.query.page * 1 || 1;
  const skip = (page - 1) * limit;

  console.log('req.query.page');
  console.log(req.query);
  console.log(req.query.page);

  const gallery = await Gallery.find(filterData).skip(skip).limit(limit).populate({
    path: 'category_id',
    select: 'name _id',
  });

  const count = await Gallery.countDocuments(filterData);
  const totalPages = Math.ceil(count / limit);
  let message = '';
  if (req.query.m) {
    if (req.query.m === '1') {
      message = 'Photo added';
    } else if (req.query.m === '2') {
      message = 'Photo deleted';
    }
  }

  res.status(200).json({
    title: 'Gallery',
    gallery,
    categories,
    currentPage: page,
    page,
    limit,
    totalPages,
  });
});

exports.addReminder = catchAsync(async (req, res, next) => {
  let categories = await Category.find().sort({ order: 1 });

  if (!categories) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    title: 'Add gallery',
    status: 'success',
    categories,
  });
});

exports.createReminder = catchAsync(async (req, res, next) => {
  try {
    req.body._id = new mongoose.Types.ObjectId();

    for (const file of req.files) {
      const tempPath = file.path;
      const destinationPath = path.join('./uploads/gallery', file.filename);
      fs.renameSync(tempPath, destinationPath);
    }

    for (const fileName of req.files) {
      const tempPath = fileName.path;
      const gallery = await Gallery.create({
        photo: fileName.filename,
        category_id: req.body.category_id,
      });
    }

    res.status(200).json({
      message: 'Photo successfully uploaded',
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: err,
    });
  }
});

exports.deleteReminder = catchAsync(async (req, res, next) => {
  const doc = await Gallery.findByIdAndDelete(req.body.id);

  try {
    fs.unlinkSync(`./uploads/gallery/${doc.photo}`);
  } catch (err) {
    console.error('Error:', err);
  }

  res.status(200).json({
    status: 'success',
    message: 'Photo deleted',
  });
  if (!doc) {
    res.status(200).json({
      message: 'error',
    });
  }
});

exports.updateReminder = catchAsync(async (req, res, next) => {
  try {
    const photoId = req.body.id;
    const name = req.body.name;

    console.log(photoId);
    console.log(name);

    const photo = await Gallery.findOne({ _id: photoId });

    if (!photo) {
      return res.status(404).json({
        message: 'Photo not found',
      });
    }

    photo.name = name;
    try {
      await photo.save();
    } catch (error) {
      console.error('Error:', error);
    }

    res.status(200).json({
      message: 'Photo successfully updated',
    });
  } catch (err) {
    res.status(200).json({
      message: err,
    });
  }
});

exports.Photo = catchAsync(async (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(process.env.FILE_PATH, 'uploads/gallery', filename);
  res.sendFile(filePath);
});
