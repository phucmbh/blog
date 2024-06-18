const multer = require('multer');
const MAX_10_MB = 10000000;

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
  limits: { fileSize: MAX_10_MB },
  fileFilter: function (req, file, callback) {
    if (file.mimetype.split('/')[0] === 'image') return callback(null, true);

    callback(new multer.MulterError('File is not of the correct type'), false);
  },
});


module.exports = upload;
