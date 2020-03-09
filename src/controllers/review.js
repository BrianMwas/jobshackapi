const Review = require('../models/reviews');


exports.addReview = function(req, res, next) {
    const user = req.resources.user;
    const company = req.resources.company;
    const { pros, cons, rating } = req.body; 

    const review = new Review({
        userIdEntry: user._id,
        companyIdEntry: company._id,
        pros: pros,
        cons: cons,
        rating: rating
    });


    review.save()
    .then(review => {
        if(!review) {
            res.json({
                message: "Sorry we could'nt add your review try refreshing"
            });
        }

        req.resources.review = review;
        next();
    })
    .catch(error => {
        if(error.name == 'ValidationError') {
            for (var field in error.errors) {
                res.status(401).json({
                    message: "We could not add your review.",
                    error: error.errors[field].message
                })
            }
        } else {
            res.status(401).json({
                message: "Review could not be added!!"
            })
        }
    })
};

exports.show = function(req, res, next) {
     Review.find({})
    .then(reviews => {
        if(!reviews) {
            res.json({
                message: "We could not fetch the reviews now"
            })
        }
        req.resources.reviews = reviews;
        next();
    })
    .catch(error => {
        res.status(500).json({
            message: "Sorry we failed on our end.",
            error: error
        });
    });
};

// exports.deleteReview = function(req, res, next) {
//     const userId = req.resources.user._id;
//     const companyId = req.resources.company._id;

//     Review.findOneAndUpdate({})
//     .then(review => {

//     })
//     .catch(error => {
//         res.status(401).json({
//             error: error
//         })
//     })
// }

// exports.patcher = function (req, res, next) {
//     Application.findById(req.params.applicationId)
//         .then(application => {
//             if (!application) {
//                 res.status(403).json({
//                     message: 'Application not found'
//                 })
//             }
//             if (req.body._id) {
//                 delete req.body._id;
//             }

//             for (let prop in req.body) {
//                 application[prop] = req.body[b];
//             }

//             application.save()
//                 .then(updatedApplication => {
//                     req.resources.application = updatedApplication
//                     next();
//                 })
//                 .catch(error => {
//                     next(error);
//                 })
//         })
//         .catch(error => {
//             next(error);
//         })
// }