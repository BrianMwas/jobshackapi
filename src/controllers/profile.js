
const Profile = require("../models/user-profile");
// import * as FileUpload from "filestack-js";

exports.create = function(req, res, next) {
    console.log("yes")
    const userId = req.resources.user._id;
    let imageUrl;
    let role;
    // const remove = path.join(__dirname, '..','..', 'public');
    // const relPath = req.file.path.replace(remove, '');

    if(req.body.role == "job-seeker") {
        role = "seeker";
    } else if(req.body.role == "employer") {
      role = "employer"
    }
    // const client = FileUpload.init(process.env.fileStackApi);

    // client.upload(req.file)
    // .then(data => {
    //   imageUrl = data.url;
    // })
    const newProfile = new Profile({
        username: req.body.username,
        telephone: req.body.telephoneNumber,
        role
    });
    newProfile.user = userId;
    // newProfile.profileImage = imageUrl;
    newProfile.save()
    .then(profile => {
        if(!profile) {
            res.status(302).json({
                message: "Profile add failed",
                success: false
            })
        }
        req.resources.profile = profile;
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

exports.show = function(req, res, next) {
    console.log("arrived")
    const {_id : userId } = req.resources.user;
    Profile.findOne({user: userId})
    .then(profile => {
        if(!profile) {
            return res.status(400).json({
                message: "You lack a profile"
            })
        } 

        console.log("profile user", profile)
        req.resources.profile = profile;
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
    })
}

exports.updateProfile = function (req, res, next) {
    // let profile = req.resources.profile;

    // for(let prop in req.body) {
    //     profile[prop] = req.body[prop];
    // }

    req.resources.profile.username = req.body.username;
    req.resources.profile.telephone = req.body.telephone;

    req.resources.profile.save()
    .then(result => {
        if(!result) {
            res.json({
                success: true,
                message: "Sorry we could not update the profile."
            })
        };

        req.resources.profile = result;
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
    })
}
