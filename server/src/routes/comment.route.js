const router = require('express').Router();
const ctrls = require('../controller/comment.controller');

const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/add-comment', verifyJWT, ctrls.addComment);
router.post('/delete-comment', verifyJWT, ctrls.deleteComment);

router.get('/get-blog-comments', ctrls.getBlogComments);
router.post('/get-replies', ctrls.getReplies);

module.exports = router;
