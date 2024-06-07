const Blog = require('../model/Blog');
const User = require('../model/User');
const Comment = require('../model/Comment');
const Notification = require('../model/Notification');

const deleteComments = async (_id) => {
  const comment = await Comment.findOneAndDelete({ _id });
  if (comment.parent) {
    await Comment.findOneAndUpdate(
      { _id: comment.parent },
      { $pull: { children: _id } }
    );
    console.log('comment delete from parent');
  }

  await Notification.findOneAndDelete({ comment: _id });
  console.log('comment notification deleted');

  await Notification.findOneAndUpdate({ reply: _id }, { $unset: { reply: 1 } });
  console.log('reply notification deleted');

  await Blog.findOneAndUpdate(
    { _id: comment.blog_id },
    {
      $pull: { comments: _id },
      $inc: { 'activity.total_comments': -1 },
      'activity.total_parent_comments': comment.parent ? 0 : -1,
    }
  );

  if (comment.children.length) {
    comment.children.map((replies) => {
      deleteComments(replies);
    });
  }
};

var that = (module.exports = {
  addComment: async (req, res) => {
    try {
      let user_id = req.user;
      let { _id, comment, blog_author, replying_to, notification_id } =
        req.body;

      if (!comment.length) {
        return res
          .status(403)
          .json({ error: 'Write something to leave a comment' });
      }

      //creating a comment doc
      let commentObj = {
        blog_id: _id,
        blog_author,
        comment,
        commented_by: user_id,
      };

      if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true;
      }

      const commentFile = await new Comment(commentObj).save();

      let { commentedAt, children } = commentFile;

      await Blog.findOneAndUpdate(
        { _id },
        {
          $push: { comments: commentFile._id },
          $inc: {
            'activity.total_comments': 1,
            'activity.total_parent_comments': replying_to ? 0 : 1,
          },
        }
      );

      console.log('New comment created');

      let notificationObj = {
        type: replying_to ? 'reply' : 'comment',
        blog: _id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id,
      };

      if (replying_to) {
        notificationObj.replied_on_comment = replying_to;

        const replyingToCommentDoc = await Comment.findOneAndUpdate(
          { _id: replying_to },
          { $push: { children: commentFile._id } }
        );

        notificationObj.notification_for = replyingToCommentDoc.commented_by;

        if (notification_id) {
          const notificationUpdate = await Notification.findOneAndUpdate(
            { _id: notification_id },
            { reply: commentFile._id }
          );

          if (!notificationUpdate)
            return res.status(500).json({ error: 'Notification not updated' });
          console.log('notification updated');
        }
      }

      await new Notification(notificationObj).save();
      console.log('new notification created');

      return res.status(200).json({
        comment,
        commentedAt,
        _id: commentFile._id,
        user_id,
        children,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getBlogComments: async (req, res) => {
    try {
      const { blog_id, skip } = req.body;

      const maxLimit = 5;
      const comment = await Comment.find({ blog_id, isReply: false })
        .populate(
          'commented_by',
          'personal_info.username personal_info.fullname personal_info.profile_img'
        )
        .skip(skip)
        .limit(maxLimit)
        .sort({
          commentedAt: -1,
        });

      return res.status(200).json(comment);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  getReplies: async (req, res) => {
    try {
      const { _id, skip } = req.body;

      const maxLimit = 5;

      const replies = await Comment.findOne({ _id })
        .populate({
          path: 'children',
          options: {
            limit: maxLimit,
            skip: skip,
            sort: { commentedAt: -1 },
          },
          populate: {
            path: 'commented_by',
            select:
              'personal_info.profile_img personal_info.fullname personal_info.username',
          },
          select: '-blog_id -updatedAt',
        })
        .select('children');
      return res.status(200).json({ replies: replies.children });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      let user_id = req.user;

      let { _id } = req.body;

      const comment = await Comment.findOne({ _id });
      if (user_id == comment.commented_by || user_id == comment.blog_author) {
        deleteComments(_id);

        return res.status(200).json({ status: 'done' });
      } else {
        return res
          .status(403)
          .json({ error: 'You can not delete the comment' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
});