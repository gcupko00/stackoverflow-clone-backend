var mongoose = require('mongoose');

var questionScheme = mongoose.Schema({
	local: {
		title: String,
		description: String,
		tags: [String],
		rating: Number,
		answersCount: Number,
		views: Number,
		dateAdded: Date,
		answers: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Answer'
		}],
        _user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
	}
});

module.exports = mongoose.model('Question', questionScheme);