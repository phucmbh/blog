const router = require('express').Router();
const ctrls = require('../controller/user.controller');

const { verifyJWT } = require('../middleware/verifyJWT');

router.post('/signup', ctrls.signup);
router.post('/signin', ctrls.signin);
router.post('/google-auth', ctrls.signinByGoogle);
router.post('/search-users', ctrls.searchUser);
router.post('/get-profile', ctrls.getProfile);

router.post('/change-password', verifyJWT, ctrls.changePassword);
router.post('/update-profile', verifyJWT, ctrls.updateProfile);
router.post('/update-profile-img', verifyJWT, ctrls.updateProfileImage);
router.post('/isliked-by-user', verifyJWT, ctrls.isLikedByUser);

module.exports = router;
