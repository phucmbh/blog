const Blog = require('../model/Blog');
const User = require('../model/User');
const Comment = require('../model/Comment');
const Notification = require('../model/Notification');
const { v4: uuidv4 } = require('uuid');

var that = (module.exports = {
  createBlog: async (req, res) => {
    let authorId = req.user;
    // let val = 0;

    let { title, des, banner, tags, content, draft, id } = req.body;

    if (!title.length) {
      return res.status(403).json({
        success: false,
        error: 'You must provide a title to your blog',
      });
    }

    if (!draft) {
      if (!des.length || des.length > 200) {
        return res.status(403).json({
          success: false,
          error: 'You must provide blog description under 200 characters',
        });
      }

      if (!banner.url?.length) {
        return res.status(403).json({
          success: false,
          error: 'You must provide blog banner to publish the blog',
        });
      }

      if (!content.length) {
        return res.status(403).json({
          success: false,
          error: 'There must be some blog content to publish the blog',
        });
      }

      if (!tags.length || tags.length > 10) {
        return res.status(403).json({
          success: false,
          error: 'Provide tags in order to publish the blog, Maximum 10',
        });
      }
    }

    tags = tags.map((tag) => tag.toLowerCase());

    let blog_id =
      id ||
      title
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .replace(/\s+/g, '-')
        .trim() + uuidv4();

    if (id) {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        { title, des, banner, content, tags, draft: draft ? draft : false },
        { new: true }
      );

      if (!blog)
        return res
          .status(500)
          .json({ success: false, error: 'Create blog is failed' });

      return res.status(200).json({ success: true, id: blog_id });
    } else {
      const blog = new Blog({
        title,
        des,
        banner,
        content,
        tags,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
      });

      const newBlog = await blog.save();

      if (!newBlog)
        return res
          .status(500)
          .json({ success: false, error: 'Cant not create draft' });
      let incrementVal = draft ? 0 : 1;
      const user = await User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { 'account_info.total_posts': incrementVal },
          $push: { blogs: blog._id },
        }
      );

      if (!user)
        return res.status(500).json({
          success: false,
          error: 'Failed to update total posts number',
        });

      return res.status(200).json({ success: true, id: blog.blog_id });
    }
  },

  getBlog: async (req, res) => {
    try {
      let { blog_id, draft, mode } = req.body;

      let incrementVal = mode != 'edit' ? 1 : 0;
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        { $inc: { 'activity.total_reads': incrementVal } }
      )
        .populate(
          'author',
          'personal_info.profile_img personal_info.username personal_info.fullname'
        )
        .select('title des content banner activity publishedAt blog_id tags');
      if (blog)
        await User.findOneAndUpdate(
          { 'personal_info.username': blog.author.personal_info.username },
          { $inc: { 'account_info.total_reads': incrementVal } }
        );

      if (blog.draft && !draft) {
        return res
          .status(500)
          .json({ error: 'You can not access draft blogs' });
      }

      return res.status(200).json({ blog, success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message, success: false });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      let user_id = req.user;
      let { blog_id } = req.body;

      const blog = await Blog.findOneAndDelete({ blog_id });
      await Notification.deleteMany({ blog: blog._id }).then((data) =>
        console.log('Notifications deleted')
      );

      await Comment.deleteMany({ blog_id: blog._id }).then((data) =>
        console.log('Comments deleted')
      );

      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $pull: { blog: blog._id },
          $inc: { 'account_info.total_posts': blog.draft ? 0 : -1 },
        }
      ).then((user) => console.log('Blog deleted'));

      return res.status(200).json({ status: 'done' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  latestBlogs: async (req, res) => {
    try {
      let { page } = req.body;
      let maxLimit = 5;

      const blogs = await Blog.find({ draft: false })
        .populate(
          'author',
          'personal_info.profile_img personal_info.username personal_info.fullname -_id'
        )
        .sort({ publishedAt: -1 })
        .select('blog_id title des banner activity tags publishedAt -_id')
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  allLatestBlogsCount: async (req, res) => {
    try {
      const count = await Blog.countDocuments({ draft: false });
      return res.status(200).json({ totalDocs: count });
    } catch (error) {
      console.log(err.message);
      return res.status(500).json({ error: error.message });
    }
  },

  trendingBlogs: async (req, res) => {
    try {
      const blogs = await Blog.find({ draft: false })
        .populate(
          'author',
          'personal_info.profile_img personal_info.username personal_info.fullname -_id'
        )
        .sort({
          'activity.total_read': -1,
          'activity.total_likes': -1,
          publishedAt: -1,
        })
        .select('blog_id title publishedAt -_id')
        .limit(5);

      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  searchBlogs: async (req, res) => {
    try {
      let { tag, query, author, page, limit, eliminate_blog } = req.body;

      let findQuery;

      if (tag) {
        findQuery = {
          tags: tag,
          draft: false,
          blog_id: { $ne: eliminate_blog },
        };
      } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
      } else if (author) {
        findQuery = { author, draft: false };
      }

      let maxLimit = limit ? limit : 2;

      const blogs = await Blog.find(findQuery)
        .populate(
          'author',
          'personal_info.profile_img personal_info.username personal_info.fullname -_id'
        )
        .sort({ publishedAt: -1 })
        .select('blog_id title des banner activity tags publishedAt -_id')
        .skip((page - 1) * maxLimit)
        .limit(maxLimit);

      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  searchBlogsCount: async (req, res) => {
    try {
      let { tag, author, query } = req.body;

      let findQuery;

      if (tag) {
        findQuery = { tags: tag, draft: false };
      } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') };
      } else if (author) {
        findQuery = { author, draft: false };
      }

      const count = await Blog.countDocuments(findQuery);

      return res.status(200).json({ totalDocs: count });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  likeBlog: async (req, res) => {
    try {
      let user_id = req.user;

      let { _id, islikedByUser } = req.body;

      let incrementVal = !islikedByUser ? 1 : -1;

      const blog = await Blog.findOneAndUpdate(
        { _id },
        { $inc: { 'activity.total_likes': incrementVal } }
      );

      if (!blog) {
        return res.status(500).json({ error: 'Blog not found' });
      }

      if (!islikedByUser) {
        let like = new Notification({
          type: 'like',
          blog: _id,
          notification_for: blog.author,
          user: user_id,
        });

        await like.save();
        return res.status(200).json({ liked_by_user: true });
      } else {
        await Notification.findOneAndDelete({
          user: user_id,
          blog: _id,
          type: 'like',
        });

        return res.status(200).json({ liked_by_user: false });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  userWrittenBlogs: async (req, res) => {
    try {
      const user_id = req.user;

      const { page, draft, query, deletedDocCount } = req.body;

      const maxLimit = 5;
      let skipDocs = (page - 1) * maxLimit;

      if (deletedDocCount) {
        skipDocs -= deletedDocCount;
      }

      const blogs = await Blog.find({
        author: user_id,
        draft,
        title: new RegExp(query, 'i'),
      })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 })
        .select('title banner publishedAt blog_id activity des draft -_id');
      return res.status(200).json({ blogs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  userWrittenBlogsCount: async (req, res) => {
    try {
      const user_id = req.user;

      const { draft, query } = req.body;

      const count = await Blog.countDocuments({
        author: user_id,
        draft,
        title: new RegExp(query, 'i'),
      });

      return res.status(200).json({ totalDocs: count });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ erroror: err.message });
    }
  },
});
