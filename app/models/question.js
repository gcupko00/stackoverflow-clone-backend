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
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
	}
}).index({ 'local.title': 'text', 'local.description': 'text' });

module.exports = mongoose.model('Question', questionScheme);