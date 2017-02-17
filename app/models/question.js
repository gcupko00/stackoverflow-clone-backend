var mongoose = require('mongoose');

var questionScheme = mongoose.Schema({
	local: {
		title: String,
		description: String,
		tags: [String],
		rating: Number,
		answers: Number,
		views: Number
	}
});

module.exports = mongoose.model('Question', questionScheme);