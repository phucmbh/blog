const jwt = require('jsonwebtoken');

const { SECRET_ACCESS_KEY } = process.env;

var that = (module.exports = {
  verifyJWT: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1] || '';

      jwt.verify(token, SECRET_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ error: 'Access token is invalid' });
        }

        req.user = user.id;
        next();
      });
    } catch (error) {
      return res.status(500).json({ error: 'You must login to access this' });
    }
  },
});
