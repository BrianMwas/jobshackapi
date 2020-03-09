const _ = require('lodash');
const MAX_LIMIT = 50;
const Company = require('../models/company')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

exports.create = async function(req, res, next) {
    let { name, summary, country, address, website, contact } =  req.body
    let owner = req.userData.userId;
    
    let newCompany = new Company({
        name: name,
        country: country,
        address: address,
        summary,
        owner: owner,
        contact,
        website
    });
    await newCompany
    .save()
    .then(company => {
         if(!company) {
             res.json({
                 success: false,
                 message: "Sorry we were unable to create a company"
             })
         }
         req.resources.company = company;
         next();
        }
    )
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

exports.checkUserCompany = async function(req, res, next) {
   await Company.findOne({
        owner: req.userData.userId
    })
    .then(company => {
        if(company) {
            return res.status(409).json({
                message: 'You already are the owner of ' + company.name,
                type: 'user_has_company'
            })
        } 
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

exports.show = async function(req, res, next) {

    if (!ObjectId.isValid(req.params.companyId)) {
        return res.status(404).send({
            message: 'Not found.'
        });
    };
    await Company.findById({_id : req.params.companyId})
    .populate('reviews', 'pros cons rating -_id ')
    .populate('jobs')
    .then(company => {

        if(!company) {
            res.status(409).json({
                success: false,
                message: "No company found!"
            })
        }
        req.resources.company = company
        next()
    })
    .catch(error=> {
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


exports.companyByOwnerId = function(req, res, next) {
  console.log("req", req)
  Company.findOne({
    owner: req.userData.userId
  })
  .populate('jobs')
  .populate('members')
  .populate('reviews')
  .then(res => {
    if(!res) {
      res.json({
        message: "Company was not found"
      })
    }
      console.log("res", res)

      req.resources.company = res;
      next();
  }).catch(error => {
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

exports.bySlug = async function(req, res, next ) {

  await Company.findOne({
        slug: req.params.slug
    })
    .populate('reviews', 'pros cons rating -_id ')
    .populate('members')
    .populate('jobs')
    .then(company => {
        if(!company) {
            return res.status(403).json({
                success: false,
                message: "Company has not been found..."
            })
        }

        req.resources.company = company
        next()
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


exports.index = async function(req, res, next) {
    // const limit = +req.query.limit || MAX_LIMIT;
    // const skip = +req.query.skip || 0;
    // let { country } = req.query

    await Company.find()
    .populate('reviews', '-_id')
    .populate('jobs')
    .exec()
    .then(companies => {
        if(companies.length <= 0) {
            res.json({
                success: false,
                message: "Sorry no company found. "
            }) 
        }
        req.resources.companies = companies
        next()
    })
    .catch(error => {
        if(error.name == 'ValidationError' && error.code === 11000) {
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



exports.update = async function(req, res, next) {
   let data = await _.pick(req.body, ['name', 'country', 'summary', 'address', 'website', 'contact']);
   await _.assign(req.resources.company, data);

    await req.resources.company.save()
    .then(updatedCompany => {
      console.log("company", updatedCompany)
        req.resources.company = updatedCompany
        next()
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

exports.addMember = async function(req, res, next) {
    var includes = _.includes(req.resources.company.members, req.body.member);

    if(includes) {
        return res.status(409).json({
            message: "User is already a member of your company",
            type: "already_member"
        })
    }

    await req.resources.company.members.push(req.body.member);
    await req.resources.company.save()
    .then(updatedCompany => {
        req.resources.company = updatedCompany;
        next()
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

exports.removeMember =  function(req, res, next) {
    var includes = _.includes(req.resources.company.members, req.body.member);

    if (!includes) {
        return res.status(409).json({
            message: 'User is not a member of your company',
            type: 'not_member'
        });
    }

    Company.findByIdAndUpdate(req.params.companyId, { $pull : { members: req.body.member }}, { safe: true, upsert: true }, (err, company) => {
        if(err) {
            res.status(409).json({
                message: "An error occurred" + err
            })
        }
        req.resources.company = company
        next();
    })
}
