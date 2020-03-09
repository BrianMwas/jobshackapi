const mongoose = require('mongoose');
const commonHelper = require('../../helpers/common');
const Industries = require('../../config/variables/industries');
const Countries = require('../../config/variables/countries');
const Jobtypes = require('../../config/variables/jobtypes');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const indEnum = Industries.map(item => item.name);
const cntEnum = Countries.map(item => item.country);
const jobEnum = Jobtypes.map(item => item.name);

let JobSchema = new Schema({
    company: {
        type: ObjectId,
        ref: 'Company',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    summary: {
        type: String,
        maxlength: 250
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: jobEnum
    },
    industry: {
        type: String,
        required: true,
        enum: indEnum
    },
    country: {
        type: String,
        required: true,
        enum: cntEnum
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
         toJSON: {virtuals : true},
          toObject: {virtuals : true},
          timestamps: true
    });

JobSchema.index({'$**': 'text'});

JobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job'
})

JobSchema.pre('save', function (next) {
    this.slug = commonHelper.createSlug(this.title);
    console.log(this.title)
    next();
});

module.exports = mongoose.model('Job', JobSchema);
