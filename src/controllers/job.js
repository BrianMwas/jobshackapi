const MAX_LIMIT = 50

const JOB_FIELDS = ['title', 'summary', 'description', 'type', 'industry', 'country']
const SEARCH_QUERIES = ['type', 'country', 'industry', 'company']


const mongoose = require('mongoose');
const Job = require('../models/job')
const ObjectId = mongoose.Types.ObjectId;
const _ = require('lodash')

exports.create = function(req, res, next) {
    let data = _.pick(req.body, JOB_FIELDS);

    data.company = req.resources.company._id;

    Job.create(data)
    .then(job => {
        if(!job) {
            res.json({
                success: false,
                message: "Sorry we could not add the job"
            })
        }
        req.resources.newJob = job;
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
};

exports.search = function(req, res, next) {
    let { term } = req.query;
    if(term.length < 0) {
      return res.json({
        message: "Please enter a valid search.."
      })
    }
    console.log("search")
    Job.find({
      $text : {
        $search: term
      }
    })
    .populate('company')
    .then(results => {
        if (!results) {
            return res.status(401).json({
                success: true,
                message: "Sorry we could not find any info about :"+ search
            })
        }
        req.resources.jobs = results;
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

exports.show = function(req, res, next) {
     if (!ObjectId.isValid(req.params.jobId)) {
         res.status(404).send({
             message: 'Not found.'
         });
     };

     Job.findById(req.params.jobId)
     .where('deleted', false)
     .select('-deleted')
     .populate("company")
     .populate('applications')
     .then(job => {
         if(!job) {
             res.json({
                 message: "Sorry job not found",
                 success: false
             })
         }
        req.resources.job = job
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

exports.category= function(req, res, next) {
	let { industry, jobtype, country } = req.query;
 
	Job.find({ })
  .or([ 
    { country }, 
    { industry }, 
    { type: jobtype }
  ])
  .where('deleted', false)
  .select('-deleted')
  .populate('company')
	.then(results => {
		if(results.length <= 0) {
			return res.json({
				success: true,
				message: "We could not find any"
			})
		}

		req.resources.jobListing = results;
		next();
	}).catch(error => {
		  if(error.name == 'MongoError' && error.code === 11000) {
          return res.status(409).json({
            success: false,
            message: [err.message]
          })
        }
        res.status(500).json({
          message: "Sorry something happenend on our end :"+error
        })
	})

}

exports.index = function(req, res, next) {
    const limit = +req.query.limit || MAX_LIMIT;
    const skip = +req.query.skip || 0;
    let query = _.pick(req.query, SEARCH_QUERIES);

    if(req.params.companyId) {
        query.company = req.params.companyId
    };

    Job.find(query)
    .where('deleted', false)
    .select('-deleted')
    .populate({
      path: 'company',
      select: '-_id name country slug address'
    })
    .exec()
    .then(jobs => {
        if(jobs.length <= 0) {
            res.json({
                message: "Sorry no jobs yet",
                success: false
            })
        } 
        req.resources.jobs = jobs;
        
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

exports.update = function(req, res, next) {
    let data = _.pick(req.body, ['title', 'summary', 'description', 'type', 'industry', 'country']);
    _.assign(req.resources.job, data);

    req.resources.job.save()
    .then(updatedJob => {
        if(!updatedJob) {
            res.json({
                message: "Sorry we could not update",
                success: false
            })
        }
        req.resources.updatedJob = updatedJob;
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

exports.destroy = function (req,res, next) {
    req.resources.job.deleted = true

    req.resources.job.save()
    .then(result => {
        if(result) {
            res.json({
                message: "Job deleted successfully"
            })
        } else {
            res.json({
                message: 'Failed to delete...'
            })
        }
    })
    .catch(error=> {
        next(error)
    })
}
