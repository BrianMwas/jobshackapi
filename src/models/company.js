const mongoose = require('mongoose');

const Countries = require('../../config/variables/countries');
const cntEnum = Countries.map(item => item.name);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const commonHelper = require('../../helpers/common');



let CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    owner: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    summary: {
        type: String
    },
    members: {
        type: Array,
        default: []
    },
    country: {
        type: String,
        required: true,
        
        enum: cntEnum
    },
    address: {
        type: String,
        required: true
    },
    website: String,
    contact: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
    }, 
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
    {
        versionKey: false
    }
);


CompanySchema.virtual('reviews', {
    ref : 'Review',
    localField: '_id',
    foreignField: 'companyIdEntry'
});

CompanySchema.virtual('jobs',  {
    ref: 'Job',
    localField: '_id',
    foreignField: 'company'
});

// UserSchema.virtual('image', {
//     ref: 'Image',
//     localField: '_id',
//     foreignField: 'userIdEntry'
// });


CompanySchema.pre('save', function (next) {
    this.slug = commonHelper.createSlug(this.name);
    console.log(this.name)
    next();
});

// compile Company model
module.exports = mongoose.model('Company', CompanySchema);