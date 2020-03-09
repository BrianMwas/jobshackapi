const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


let ApplicationSchema = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'processed']
    },
    job: {
        type: ObjectId,
        required: true,
        ref: 'Job'
    },
    deleted: {
        type: Boolean,
        default: false,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
        versionKey: false
    });

module.exports = mongoose.model('Application', ApplicationSchema);
