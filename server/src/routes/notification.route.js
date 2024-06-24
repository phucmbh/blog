const router = require('express').Router();
const ctrls = require('../controller/notification.controller');

const { verifyJWT } = require('../middleware/verifyJWT');

router.get('/new-notification', verifyJWT, ctrls.newNotification);
router.get('/notifications', verifyJWT, ctrls.notifications);
router.post('/all-notifications-count', verifyJWT, ctrls.allNotificationsCount);

module.exports = router;
