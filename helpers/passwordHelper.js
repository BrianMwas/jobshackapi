
const bcrypt = require('bcryptjs')
const SALTROUNDS = 10;





module.exports.hash = hashPassword;
module.exports.verify = verifyPassword;
module.exports.compareIt = compareIt;


function  hashPassword(password) {
     bcrypt.genSaltSync(SALTROUNDS, function(err, salt) {
        if(err) return;
        bcrypt.hashSync(password, salt, function(err, hash) {
            if(err) return;
            return hash;
        });
    });
}

function  verifyPassword(password1, password2) {
    bcrypt.compareSync(password1, password2, function(err, res) {
    if(err) return;
    return res;
    });
}

module.exports.hashit = function hashit(password, rounds, cb) {
  bcrypt.genSalt(rounds, function(err, salt) {
        if(err) return next(err);
        bcrypt.hash(password, salt, function(err, hash) {
            cb(err, hash);
        });
    });
}

function  compareIt(password, hash,  cb) {
  bcrypt.compare(password, hash, function(err, result) {
        cb(err, result);
    });
};