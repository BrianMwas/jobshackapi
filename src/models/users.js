
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")
const passwordHelper = require('../../helpers/passwordHelper');



var UserSchema = new Schema({
  fullName: {
    type: String,
    trim: true
  },
  email : {
    type : String,
    required: true,
    unique : true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  },
  password : {
    type: String,
    required: true,
    minlength: 10,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, 
{
  toJSON: {virtuals : true},
  toObject: {virtuals : true}
}, {
  versionKey : false
});

UserSchema.virtual('profile', {
  ref: 'UserProfile',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('qualifications', {
  ref: 'Qualification',
  localField: '_id',
  foreignField: 'user'
})


UserSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'user'
})

UserSchema.pre('save', function(next) {
  var user = this;
  passwordHelper.hashit(user.password, 10, function(err, hash) {
    if(err) next(err);
    user.password = hash;
    next();
  });
});

UserSchema.methods.verifyPassword = function(password) {
  let result;
  result =  bcrypt.compare(password, this.password);
  return result;
};



// //For changing the password.
//  UserSchema.methods.changePassword = function(oldPassword, newPassword, callback) {
//    //Return the user with the password and salt.
//    this.model('User').findById(this.id).select('+password +passwordSalt').exec((err, user) => {
//      if(err) return callback(err, null);

//      //No user found just return the empty user.
//      if(!user) return callback(err, null);

//     //  passwordHelper.verify(oldPassword, user.password, user.passwordSalt, (err, result) => {
//     //    if(err) return callback(err, null);

//     //    //If password  does not match don't return user.

//     //    if(result === false) {
//     //      let PassNotMatch = new Error("Old password does not match");
//     //      PassNotMatch.type =  'old_password_does_not_match';
//     //      return callback(PassNotMatch, null);
//     //    }

//     //    //generate the new password and save the changes.
//     //    passwordHelper.hash(newPassword, (err, hashedPassword, salt) => {
//     //      this.password = hashedPassword;
//     //      this.passwordSalt = salt;

//     //      this.save(function(err, saved) {
//     //        if(err) return callback(err, null);

//     //        if(callback) {
//     //          return callback(err, {
//     //            success: true,
//     //            message: 'Password changed successfully.',
//     //            type: 'passsword_change-success'
//     //          })
//     //        }
//     //      })
//     //    })
//     //  })
//    })
//  }


module.exports = mongoose.model('User', UserSchema);
