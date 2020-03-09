
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const _ = require('lodash');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'public', 'files', `${Date.now()}`);
        fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var limits = {
    files: 1, // allow only 1 file per request
    fileSize: 15 * 1024 * 1024, // 5 MB (max file size)
};

function filter(req, file, cb) {
    var allowedMimes = /doc|pdf|docx/;
    var mimetype = allowedMimes.test(file.mimetype);
    var extname = allowedMimes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(next("Error: File upload only accepts the following types" + filetypes));
    }
}

module.exports = multer({
    storage: storage,
    // limits: limits,
    // fileFilter: filter
}).single('doc');