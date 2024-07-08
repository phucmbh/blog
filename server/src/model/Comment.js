const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    blog_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'blogs',
    },
    blog_author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'blogs',
    },
    comment: {
      type: String,
      required: true,
    },
    children: {
      type: [mongoose.Types.ObjectId],
      ref: 'comments',
    },
    commented_by: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: 'users',
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'comments',
    },
  },
  {
    timestamps: {
      createdAt: 'commentedAt',
    },
  }
);

module.exports = mongoose.model('comments', commentSchema);
