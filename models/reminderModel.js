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
    deadline: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reminder must belong to a user'],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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
