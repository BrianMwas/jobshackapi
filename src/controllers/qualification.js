
const Qualification = require("../models/qualification");

exports.create = function (req, res, next) {
    console.log("Yes");
    
    const userId = req.resources.user._id;
 
    const qualification= new Qualification({
        qualificationType: req.body.qualificationType,
        institute: req.body.institute,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description
    });
    qualification.user = userId;
    qualification.save()
        .then(qualifications => {
            if (!qualifications) {
                res.json({
                    message: "Fail",
                    error: "Sorry but qualification has not been set"
                });
            }

            req.resources.qualifications = qualifications;
            next();
        })
        .catch(error => {
            console.error("There seems to be an error" + error);
           if(error.name == 'MongoError' && error.code === 11000) {
              return res.status(422).json({
                success: false,
                message: error.errors[message]
              })
            }
            res.status(500).json({
              message: "Sorry something happenend on our end :"+error
            })

            
        });
};

exports.show = function (req, res, next) {
    const userId = req.resources.user.id;
    Qualification.find({ user: userId })
        .then(qualifications => {
            if (!qualifications) {
                res.status(400).json({
                    message: "You have not added a qualification!"
                });
            } 
                req.resources.qualifications = qualifications;
                next();

        })
        .catch(error => {
           if(error.name == 'MongoError' && error.code === 11000) {
              return res.status(422).json({
                success: false,
                message: error.errors[message]
              })
            }
            res.status(500).json({
              message: "Sorry something happenend on our end :"+error
            })
        });
};


exports.showById = function(req, res, next) {
    const docId = req.params.qualificationId;
    
    const qualification = req.resources.qualifications.find(i => i._id == docId);
    if(!qualification) {
        return;
    }
    req.resources.qualification = qualification;
    next();
};


exports.patcher = function(req, res, next) {
    let qualification = req.resources.qualification._id;

    Qualification.findById(req.params.qualificationId)
    .then(qualification => {
        if(!qualification) {
            res.status(403).json({
                message: 'No qualification.'
            })
        }
        if(req.body._id) {
            delete req.body._id;
        }

        for(let prop in req.body) {
            qualification[prop] = req.body[prop];
        }

        qualification.save()
        .then(updatedQualification => {
            if(!updatedQualification) {
                res.json({
                    success: true,
                    message: "Sorry something happenend"
                })
            }
            req.resources.qualification = updatedQualification
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

// exports.destroy = function (req, res, next) {
//     const docId = req.resources.qualification._id;
//     const deleteDir = require("../../helpers/util").deleteDir;
//     const path = require('path');
//     const filename = req.resources.qualification.docPath;
//     const realPath = filename.split("\\").splice(2)[0];
//     const folderDir = path.resolve(__dirname, "..", "..", "public/files/" + realPath);


//     Qualification.findByIdAndDelete({ _id: docId })
//         .then(result => {

//             deleteDir(folderDir);
//             res.status(201).json({
//                 message: "Document deleted successfully" + result
//             });
//         })
//         .catch(error => {
//             if(error.name == 'MongoError' && error.code === 11000) {
//               return res.status(422).json({
//                 success: false,
//                 message: error.errors[message]
//               })
//             }
//             res.status(500).json({
//               message: "Sorry something happenend on our end :"+error
//             })
//         });
// };

