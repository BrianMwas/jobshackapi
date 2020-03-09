
  const fs = require('fs');
  const path = require('path');
  const multer = require('multer');
  const _ = require('lodash');

  const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = path.join(__dirname, '..', 'public', 'uploads', `${Date.now()}`);
      fs.mkdirSync(uploadDir);
      console.log("yes")
      cb(null, uploadDir);
    },

    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });

var limits = {
  files: 1, // allow only 1 file per request
  fileSize: 5 * 1024 * 1024, // 5 MB (max file size)
};

  function filter(req, file, cb) {
    var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

    if(_.includes(allowedMimes, file.mimetype)) {
      cb(null, true);
    } else {
      cb("Error: File upload only supports the following filetype" + file.mimetype);
    }
  }

  module.exports = multer({
     storage: storage,
    limits: limits,
    fileFilter: filter }).single('image');
