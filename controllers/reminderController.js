const mongoose = require('mongoose');
const moment = require('moment');
const Reminder = require('../models/reminderModel');
const Category = require('../models/categoryModel');
const catchAsync = require('../middlewares/catchAsync');
const fs = require('fs');
const path = require('path');

exports.getReminders = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 12;
  const skip = (page - 1) * limit;

  const userId = req.user._id;
  const filterData = { user_id: userId };

  const reminders = await Reminder.find(filterData)
    .skip(skip)
    .sort({ deadline: -1 })
    .limit(limit)
    .populate({
      path: 'user_id',
      select: '_id name surname',
    })
    .populate({
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

  const formattedReminders = reminders.map((reminder) => {
    const formattedDeadline = moment(reminder.deadline).format('DD/MM/YYYY');
    const formattedLastEmailSend = moment(reminder.lastEmailSend).format('DD/MM/YYYY');
    return { ...reminder, formattedDeadline, formattedLastEmailSend };
  });

  res.status(200).json({
    title: 'Reminder',
    reminders: formattedReminders,
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

  const reminder = await Reminder.find(filterData).skip(skip).limit(limit).populate({
    path: 'category_id',
    select: 'name _id',
  });

  console.log(reminder);

  const count = await Reminder.countDocuments(filterData);
  const totalPages = Math.ceil(count / limit);
  let message = '';

  res.status(200).json({
    title: 'Reminder',
    categories,
    reminder,
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
    title: 'Add reminder',
    status: 'success',
    categories,
  });
});

exports.createReminder = catchAsync(async (req, res, next) => {
  try {
    req.body._id = new mongoose.Types.ObjectId();
    req.body.user_id = res.locals.user._id;
    await Reminder.create(req.body);
    res.status(200).json({
      message: 'success',
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: err,
    });
  }
});

exports.deleteReminder = catchAsync(async (req, res, next) => {
  const doc = await Reminder.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Reminder deleted',
  });
  if (!doc) {
    res.status(200).json({
      message: 'error',
    });
  }
});

exports.updateReminder = catchAsync(async (req, res, next) => {
  console.log(req.body.category_id);

  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //await reminder.save();
    if (!reminder) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'success',
    });
  } catch (err) {
    res.status(200).json({
      status: 'error',
      message: err.message,
    });
  }
});
