const User = require("../models/users");
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passwordHelper = require('../../helpers/passwordHelper');
const ROUNDS = 10;

exports.signup = function(req, res) {
    const { fullName, email, password } = req.body
    

    User.findOne({email: email})
    .then(user => {
        if(user) {
            return res.status(401).json({
                message: "User already exists"
            });
        }

        let newUser = new User({
            fullName: fullName,
            email: email,
            password: password
        });

        newUser.save()
        .then(result => {
            res.status(201).json({
                message: "User created successfully"
            })
        })
        .catch(error => {

            res.status(401).json({
                message: "User creation failed " + error
            });
        });
        
    })
    .catch(error => {
        res.status(401).json({
            error: "An error occured." + error
        });
    });
};

exports.signin = function(req, res, next) {
    const password = req.body.password;
    User.findOne({email: req.body.email})
    .select('+password')
    .populate('profile')
    .populate('qualifications')
    .populate('applications')
    .exec()
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }

        if(user.verifyPassword(password)) {
          const token =  jwt.sign(
                {
                    email: user.email,
                    userId: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: String(process.env.JWT_EXPIRATION)
                }

            );

            res.status(200).header('auth-token', token).json({
                success: true,
                message: "Authentication success",
                token
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            error: "An error occured." + error
        });
    });
};

exports.sendChangePassLink = (req, res, next) => {
    console.log('email', req.resources.authUser)
}