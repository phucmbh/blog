const User = require('../model/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Notification = require('../model/Notification');

const generateUsername = async (email) => {
  let username = email.split('@')[0];

  let isUsernameExists = await User.exists({
    'personal_info.username': username,
  }).then((result) => result);

  isUsernameExists ? (username += uuidv4().substring(0, 5)) : '';

  return username;
};

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

var that = (module.exports = {
  signup: async (req, res) => {
    try {
      let { fullname, email, password } = req.body;

      //validating the data from frontend
      if (fullname.length < 3) {
        return res
          .status(403)
          .json({ error: 'Fullname must be at least 3 letters long' });
      }
      if (!email.length) {
        return res.status(403).json({ error: 'Enter Email' });
      }
      if (!emailRegex.test(email)) {
        return res.status(403).json({ error: 'Email is Invalid' });
      }
      if (!passwordRegex.test(password)) {
        return res.status(403).json({
          error:
            'Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters',
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const username = await generateUsername(email);

      const user = new User({
        personal_info: { fullname, email, password: hashPassword, username },
      });

      const newUser = await user.save();

      return res.status(200).json(formatDatatoSend(newUser));
    } catch (error) {
      if (error.code == 11000) {
        return res.status(500).json({ error: 'Email already exists' });
      }

      return res.status(500).json({ error: err.message });
    }
  },

  signin: async (req, res) => {
    try {
      let { email, password } = req.body;
      const user = await User.findOne({ 'personal_info.email': email });
      if (!user) {
        return res.status(403).json({ error: 'Email not found' });
      }

      if (!user.google_auth) {
        if (!bcrypt.compare(password, user.personal_info.password))
          return res.status(403).json({ error: 'Incorrect password' });
        else return res.status(200).json(formatDatatoSend(user));
      } else {
        return res.status(403).json({
          error:
            'Account was created using Google. Try logging in with google.',
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  signinByGoogle: async (req, res) => {
    let { access_token } = req.body;

    getAuth()
      .verifyIdToken(access_token)
      .then(async (decodedUser) => {
        let { email, name, picture } = decodedUser;

        picture = picture.replace('s96-c', 's384-c');

        let user = await User.findOne({ 'personal_info.email': email })
          .select(
            'personal_info.fullname personal_info.username personal_info.profile_img google_auth'
          )
          .then((u) => {
            return u || null;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });

        if (user) {
          //login
          if (!user.google_auth) {
            return res.status(403).json({
              error:
                'This email was signed up without google. Please log in with password to access the account',
            });
          }
        } else {
          //sign up
          let username = await generateUsername(email);

          user = new User({
            personal_info: {
              fullname: name,
              email,
              username,
            },
            google_auth: true,
          });

          await user
            .save()
            .then((u) => {
              user = u;
            })
            .catch((err) => {
              return res.status(500).json({ error: err.message });
            });
        }

        return res.status(200).json(formatDatatoSend(user));
      })
      .catch((err) => {
        return res.status(500).json({
          error:
            'Failed to authenticate you with google. Try with some other google account',
        });
      });
  },

  changePassword: async (req, res) => {
    let { currentPassword, newPassword } = req.body;

    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return res.status(403).json({
        success: false,
        error:
          'Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters',
      });
    }

    const user = await User.findOne({ _id: req.user });
    if (!user)
      return res.status(500).json({ success: false, error: 'User not found' });

    if (user.google_auth) {
      return res.status(403).json({
        success: false,
        error:
          "You can't change account password because you signed in through google",
      });
    }

    if (!bcrypt.compareSync(currentPassword, user.personal_info.password))
      return res
        .status(403)
        .json({ success: false, error: 'Incorrect current password' });

    const hashPassword = bcrypt.hashSync(newPassword, 10);
    const newUser = await User.findOneAndUpdate(
      { _id: req.user },
      { 'personal_info.password': hashPassword }
    );

    if (!newUser)
      return res.status(500).json({
        success: false,
        error: 'Save new password is failed, please try again later',
      });

    res.status(200).json({ success: true, status: 'Password Changed' });
  },

  searchUser: async (req, res) => {
    try {
      let { query } = req.body;

      const users = await User.find({
        'personal_info.username': new RegExp(query, 'i'),
      })
        .limit(50)
        .select(
          'personal_info.fullname personal_info.username personal_info.profile_img -_id'
        );

      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      let { username } = req.body;

      const user = await User.findOne({
        'personal_info.username': username,
      }).select('-personal_info.password -google_auth -updatedAt -blogs');

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      let { username, bio, social_links } = req.body;

      let bioLimit = 150;

      if (username.length < 3) {
        return res
          .status(403)
          .json({ error: 'Username should be at least 3 letters long' });
      }

      if (bio.length > bioLimit) {
        return res.status(403).json({
          error: `Bio  should not be more than ${bioLimit} characters`,
        });
      }

      let socialLinksArr = Object.keys(social_links);

      try {
        for (let i = 0; i < socialLinksArr.length; i++) {
          if (social_links[socialLinksArr[i]].length) {
            let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

            if (
              !hostname.includes(`${socialLinksArr[i]}.com`) &&
              socialLinksArr[i] != 'website'
            ) {
              return res.status(403).json({
                error: `${socialLinksArr[i]} link is invalid. Please enter a valid link`,
              });
            }
          }
        }
      } catch (err) {
        return res.status(500).json({
          error: 'You must provide full social links with http(s) included',
        });
      }

      let updateObj = {
        'personal_info.username': username,
        'personal_info.bio': bio,
        social_links,
      };

      await User.findOneAndUpdate({ _id: req.user }, updateObj, {
        runValidators: true,
      });

      return res.status(200).json({ username });
    } catch (error) {
      if (error.code == 11000) {
        return res.status(500).json({ error: 'Username is already taken' });
      }
      return res.status(500).json({ error: error.message });
    }
  },

  updateProfileImage: async (req, res) => {
    try {
      let { url } = req.body;

      await User.findOneAndUpdate(
        { _id: req.user },
        { 'personal_info.profile_img': url }
      );

      return res.status(200).json({ profile_img: url });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  isLikedByUser: async (req, res) => {
    try {
      const user_id = req.user;

      const { _id } = req.body;

      const notification = await Notification.exists({
        user: user_id,
        type: 'like',
        blog: _id,
      });

      return res.status(200).json({ result: notification });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
});
