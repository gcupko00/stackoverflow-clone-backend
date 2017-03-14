var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
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
        ref: 'Answer'
    }],
    ratedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]
}).index({ 'username': 'text', 'email': 'text' });

module.exports = mongoose.model('User', userScheme);