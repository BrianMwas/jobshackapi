

const _ = require('lodash');
const mongoose = require('mongoose');
const User = require("../models/users");
const ObjectId = mongoose.Types.ObjectId;
const Company = require("../models/company");
const ProfileBlock = require("../models/profile-block");

exports.index = function(req, res, next) {
    User.find({})
    .populate({
        path : 'profile',
        select : '-_id'
    })
    .select('-qualifications -applications')
    .then(users => {
        if(users.length < 0) {
            res.status(201).json({
                message: "There are no users"
            });
        } else if (users.length > 0 && users != null) {
            req.resources.users = users;
            next();
        }
    }).catch(error => {
        res.status(500).json({
            message: "Sorry we failed on our end.." +error
        })
    })
}

exports.show = function(req, res, next) {
    console.log("yes user")
    let Id = req.params.userId;
    if(!ObjectId.isValid(Id)) {
        return res.status(404).json({
            message: "404 not found..."
        });
    }
    User.findById(Id)
    .populate('profile')
    .populate({
        path: 'applications',
        populate: {
            path: 'job'
        }
    })
    .populate('qualifications', '-_id')
    .then(user => {
        if(!user) {
            res.json({
                message: "Failed"
            })
        } 

        console.log("yes man")
        req.resources.user = user;
        next()
    })
    .catch(error => {
        console.log("error", error)
        res.status(500).json({
            message: `Failed on our end with ${error}`
        })
    })
}

exports.showByEmail = (req, res, next) => {
    let email = req.body.email;

    User.findOne({ email })
    .then(user => {
        if(!user) {
            res.status(401).json({
                success: false,
                message: "Sorry we could not find anyone with that email"
            })
        }

        req.resources.authUser = user;
        next();
    })
    .catch(error => {
        console.log("error", error)
        next(error)
    })
}

exports.update = function(req, res, next) {
    const url = req.protocol + '://' + req.get('host');
    const path = require('path');
    const imagepath = path.join(__dirname, '..', '..', 'public');
    var user = req.resources.user;
    req.body.image = url + imagepath + req.file.filename;
    _.assign(user, req.body);

    user.save()
    .then(user => {
        res.resources.user = user;
        next();
    })
    .catch(error => {
        next(error);
        res.status(500).json({
            message: "Sorry we failed on our end.." + error
        })
    })

}

exports.destroy = function(req, res, next) {
    req.resources.user.remove()
    .then(result => {
        res.status(204).json(result);
    })
    .catch(error => {
        next(error);
        res.status(500).json({
            message: "Sorry we failed on our end.." + error
        })
    })
}

exports.showProfile = function (req, res, next) {
    User.findById(req.params.userId)
    .select('+profile')
    .exec()
    .then(user => {
        if(!user) {
            res.status(401).json({message: "User not found"})
        }
        req.resources.user = user
        next();
    })
    .catch(err => {
        res.json(err)
        next(err);
    })
}

exports.createProfile = function(req, res, next) {
    if(!req.body.title) {
        return res.status(400).json({
            message: "Block title is required"
        });
    }

    var block = new ProfileBlock(req.body);
    req.resources.user.profile.push(block);

    req.resources.user.save()
    .then(block => {
        req.resources.block = block
        next()
    })
    .catch(error => {
        res.json(error);
        next(error)
    })
}

exports.updateProfile = function(req, res,next) {
    let block = req.resources.user.profile
    if (!block) {
        return res.status(404).json({
            message: 'You do not have a profile set yet..'
        });
    }

    if (!req.body.title) {
        return res.status(400).json({
            message: 'Block title is required'
        });
    };

    let data = _.pick(req.body, ['title', 'data']);
    _.assign(block, data);

    req.resources.user.save()
    .then(block => {
        req.resources.block = block
    })
    .catch(error => {
        req.json({
            error: error
        })
        next(err)
    })
}

exports.getUserCompanies = function(req, res, next) {
    Company.find({
        owner: req.resources.user._id
    }).then(companies => {
        req.resources.companies = companies
    })
    .catch(error => {
        req.json({
            error: error
        })
        next(err)
    })
}
