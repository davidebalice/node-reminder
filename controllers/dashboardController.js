const Reminder = require('../models/reminderModel');
const User = require('../models/userModel');
const catchAsync = require('../middlewares/catchAsync');

exports.dashboard = catchAsync(async (req, res, next) => {
  const reminderCount = await Reminder.countDocuments();
  const userCount = await User.countDocuments();

  res.status(200).json({
    users: userCount,
    reminder: reminderCount,
  });
});

exports.getDemoMode = catchAsync(async (req, res, next) => {
  res.status(200).json({
    demo: global.demo,
  });
});
