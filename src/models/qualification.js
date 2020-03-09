const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QualificationSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	qualificationType: {
		type: String,
		default: "Education",
        enum: ['Education','Work Experience', 'Seminars and Activations', 'Other']
	},
	institute: String,
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		required: true,
		default: Date.now,
		max: Date.now
	},
	description: {
		type: String,
		required: true
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('Qualification', QualificationSchema);