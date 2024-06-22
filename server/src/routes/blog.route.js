const router = require('express').Router();

const ctrls = require('../controller/blog.controller');
const { verifyJWT } = require('../middleware/verifyJWT');

router.get('/get-blogs-by-user', verifyJWT, ctrls.getBlogsByUser);
router.get('/get-drafts-by-user', verifyJWT, ctrls.getDraftsByUser);
router.post('/create-blog', verifyJWT, ctrls.createBlog);
router.post('/autosave', verifyJWT, ctrls.autoSaveContent);
router.post('/delete-blog', verifyJWT, ctrls.deleteBlog);
router.post('/like-blog', verifyJWT, ctrls.likeBlog);
router.post('/user-written-blogs', verifyJWT, ctrls.userWrittenBlogs);
router.post(
  '/user-written-blogs-count',
  verifyJWT,
  ctrls.userWrittenBlogsCount
);

router.post('/get-blog', ctrls.getBlog);
router.get('/trending-blogs', ctrls.trendingBlogs);
router.post('/search-blogs', ctrls.searchBlogs);
router.post('/search-blogs-count', ctrls.searchBlogsCount);
router.post('/latest-blogs', ctrls.latestBlogs);
router.post('/all-latest-blogs-count', ctrls.allLatestBlogsCount);

module.exports = router;
