var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        email: String,
        password: {type: String, select: false},
        imageUrl: String,
        reputation: Number,
        answers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        ratedAnswers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
        ratedQuestions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }
});

module.exports = mongoose.model('User', userScheme);