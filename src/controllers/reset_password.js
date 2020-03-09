const User = require('../models/users');
const email;


exports.sendResetPasswordLink = (req, res, next) => {
  User.findOne({
    _id: req.params.userId
  })
  .then(user => {
    email.sendMail(user.email)
  })
  .catch(error => {
    res.status(401).json({
      success: false,+
      message: "Email does not exist."
    })
  })
}
