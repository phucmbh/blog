const blogRouter = require('./blog.route');
const userRouter = require('./user.route');
const commentRouter = require('./comment.route')
const notificationRouter = require('./notification.route')

const initRouters = (app) => {
  app.use('/', blogRouter);
  app.use('/', userRouter);
  app.use('/', commentRouter);
  app.use('/', notificationRouter);
};

module.exports = initRouters;
