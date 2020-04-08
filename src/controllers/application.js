const Application = require('../models/application');
const MAX_LIMIT = 50
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

exports.create = function(req, res,next) {
    console.log("got to application")
    Application.create({
        user: req.userData.userId,
        job: req.resources.job._id
    })
    .then(application => {
        res.status(201).json({
            success: true,
            message: "Job applied successfully."
        })
        next()
    })
    .catch(error=> {
        next(error);
    })
}

exports.show = function (req, res, next) {
    if (!ObjectId.isValid(req.params.applicationId)) {
        res.status(404).send({
            message: 'Not found.'
        });
    };

    console.log("application found by Id", req.params.applicationId);

    Application.findById(req.params.applicationId)
    .populate({
        path: 'user',
        populate: {
            path: 'profile'
        },
        populate: {
            path: 'qualification'
        }
    })
    .populate('job')
    .then(application => {
        if(!application) {
            res.status(409).json({
                message : "Application info not found"
            })
        }

        application.status = 'processed';

        application.save()
        .then(newApp => {
            delete newApp.user;
            newApp.user = req.resources.user;
            req.resources.application = newApp;
            console.log("wait", newApp)
            
            next();
        })
        .catch(error => {
            next(error)
        })
    })
    .catch(error => {
        next(error);
    })
}

exports.getAll = function (req, res, next) {
    

    if(req.query.applicationStatus) {
        query.status = req.query.application.status;
    }

    Application.find({})
    .where('job', req.params.jobId)
    .populate('user')
    .populate('job')
    .exec()
    .then(applications => {
        req.resources.applications = applications;
        next()
    })
    .catch(error => {
       res.json({
           success: false,
           message: error
       })
    });
};

exports.update = function (req, res, next) {
    if (req.body._id) {
        delete req.body._id;
    }
    req.resources.application.status = req.body.status;
    req.resources.application.save()
    .then(updatedApplication => {
        if(!updatedApplication) {
            res.json({
                success: true,
                message: "Sorry something happenend"
            })
        }

        req.resources.application = updatedApplication;
    })
    .catch(error=> {
        next(error);
    })
};

exports.patcher = function(req, res, next) {
    Application.findById(req.params.applicationId)
    .then(application => {
        if(!application) {
            res.status(403).json({
                message: 'Application not found'
            })
        }
        if(req.body._id) {
            delete req.body._id;
        }

        for(let prop in req.body) {
            application[prop] = req.body[prop];
        }

        application.save()
        .then(updatedApplication => {
            if(!updatedApplication) {
                res.json({
                    success: true,
                    message: "Sorry something happenend"
                })
            }
            req.resources.application = updatedApplication
            next();
        })
        .catch(error => {
            next(error);
        })
    })
    .catch(error => {
        next(error);
    })
}

exports.destroy = function (req, res, next) {
    req.resources.application.deleted = true;

    req.resources.application.save()
    .then(application => {
        application = req.resources.application;
        res.json(req.resources.application)
    })
    .catch()
}
