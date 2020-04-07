const mongoose = require("mongoose");
const Schema = mongoose.Schema;



let UserProfileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true
	},
	profileImage: String,
	docPath: String,
	username: String,
	telephone: String,
	description: String,
	role: {
		type: String,
		required: true,
		enum: ["seeker", "employer"],
		default: 'seeker'
		}
	},
	{
		timestamp: true,
		toJSON: {virtuals : true },
	  	toObject: {virtuals : true }
	}
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);