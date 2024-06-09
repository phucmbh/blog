const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      // required: true,
    },
    des: {
      type: String,
      maxlength: 200,
      // required: true
    },
    content: {
      type: String,
      // required: true
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [mongoose.Types.ObjectId],
      ref: 'comments',
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  }
);

module.exports = mongoose.model('blogs', blogSchema);
