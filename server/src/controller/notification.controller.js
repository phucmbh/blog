const Notification = require("../model/Notification");

var that = (module.exports = {
  newNotification: async (req, res) => {
    try {
      const user_id = req.user;

      const result = await Notification.exists({
        notification_for: user_id,
        seen: false,
        user: { $ne: user_id },
      });
      if (result)
        return res.status(200).json({ new_notification_available: true });
      else return res.status(200).json({ new_notification_available: false });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: err.message });
    }
  },

  notifications: async (req, res) => {
    try {
      const user_id = req.user;

      const { page, filter, deletedDocCount } = req.body;

      const maxLimit = 10;

      const findQuery = { notification_for: user_id, user: { $ne: user_id } };

      let skipDocs = (page - 1) * maxLimit;

      if (filter != 'all') {
        findQuery.type = filter;
      }

      if (deletedDocCount) {
        skipDocs -= deletedDocCount;
      }

      const notifications = await Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate('blog', 'title blog_id')
        .populate(
          'user',
          'personal_info.fullname personal_info.username personal_info.profile_img'
        )
        .populate('comment', 'comment')
        .populate('replied_on_comment', 'comment')
        .populate('reply', 'comment')
        .sort({ createdAt: -1 })
        .select('createdAt type seen reply');

      await Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => console.log('notification seen'));

      return res.status(200).json({ notifications });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: err.message });
    }
  },

  allNotificationsCount: async (req, res) => {
    try {
      const user_id = req.user;

      const { filter } = req.body;

      const findQuery = { notification_for: user_id, user: { $ne: user_id } };

      if (filter != 'all') {
        findQuery.type = filter;
      }

      const count = await Notification.countDocuments(findQuery);
      return res.status(200).json({ totalDocs: count });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
});