var mongoose = require('mongoose');

var answerScheme = mongoose.Schema({
    _question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    rating: Number,
    dateAdded: Date
});

module.exports = mongoose.model('Answer', answerScheme);

/**
 * Created by Gligorije on 26.2.2017..
 */