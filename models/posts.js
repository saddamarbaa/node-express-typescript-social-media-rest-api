/** @format */

const mongoose = require("mongoose");

// Defining a Model and Creating posts Schema
const postSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	addedDate: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	postImage: {
		type: String,
		required: true,
	},
});

// Compile model from schema and Exported
module.exports = mongoose.model("Post", postSchema);
