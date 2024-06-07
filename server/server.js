const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const upload = require('./src/configs/multer.config.js');
const cloudinary = require('./src/configs/cloudinary.config.js');

const initRouters = require('./src/routes/index.route.js');

const server = express();
let PORT = 3000;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountKey),
// });



server.use(express.json());
server.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
});

//setting up s3 bucket
// const s3 = new aws.S3({
//   region: 'ap-south-1',
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${uuidv4()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise('putObject', {
    Bucket: 'blogging-website-new',
    Key: imageName,
    Expires: 1000,
    ContentType: 'image/jpeg',
  });
};




initRouters(server);

//upload image url route
server.get('/get-upload-url', (req, res) => {
  generateUploadURL()
    .then((url) => res.status(200).json({ uploadURL: url }))
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

server.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) throw new Error('Missing image');
  const image = await cloudinary.uploadSingle(req.file);
  return res.status(200).json(image);
});


server.listen(PORT, () => {
  console.log('listening on port -->' + PORT);
});
