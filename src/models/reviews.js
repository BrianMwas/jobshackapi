const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        select: false
    },
    companyIdEntry: {
        type: mongoose.Schema.ObjectId,
        required: true
        },
    rating: {
        type: Number,
        required: true,
        min: [0, "Minimum rating is 0"],
        max: [5, "Maximum rating is 5"]
    },
    pros: {
        type: String,
        minlength: [30, "Please summarize your review"],
        trim: true
    },
    cons: {
        type: String,
        minlength: [30, "Please summarize your review"],
        trim: true
    },
    deleted: {
        type: Boolean,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Review", ReviewSchema);