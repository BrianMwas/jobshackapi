const mongoose= require('mongoose');
const Schema = mongoose.Schema


const ImageSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true
    }, 
    path: {
        type: String,
        required: true
    },
    status: {
        type: String,
        minlength : 15,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {
        versionKey: false
    });


module.exports = mongoose.model('Image', ImageSchema);