const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastEmailSend: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    category_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Reminder must belong to a category'],
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reminder must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reminderSchema.index({ owner: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
