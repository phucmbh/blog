const express = require('express');
const mongoose = require('mongoose');
// const aws = require('aws-sdk')

const cors = require('cors');
require('dotenv').config();
const upload = require('./src/configs/multer.config.js');
const cloudinary = require('./src/configs/cloudinary.config.js');

const initRouters = require('./src/routes/index.route.js');

const server = express();
let PORT = 3000;

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
});

initRouters(server);

server.get('/', (req, res) => {
  return res.status(200).json('ok');
});

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
