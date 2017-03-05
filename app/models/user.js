var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        email: String,
        password: String,
        imageUrl: String,
        reputation: Number,
        answers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer'
        }],
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }]
    }
});

module.exports = mongoose.model('User', userScheme);