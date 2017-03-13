var mongoose = require('mongoose');

var tagScheme = mongoose.Schema({
    name: String,
    description: String,
    questionCount: Number,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
});

module.exports = mongoose.model('Tag', tagScheme);