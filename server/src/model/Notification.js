const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['like', 'comment', 'reply'],
      required: true,
    },
    blog: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'blogs',
    },
    notification_for: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    comment: {
      type: mongoose.Types.ObjectId,
      ref: 'comments',
    },
    reply: {
      type: mongoose.Types.ObjectId,
      ref: 'comments',
    },
    replied_on_comment: {
      type: mongoose.Types.ObjectId,
      ref: 'comments',
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('notification', notificationSchema);
