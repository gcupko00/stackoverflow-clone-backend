var mongoose = require('mongoose');

var answerScheme = mongoose.Schema({
    _question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    },
    local: {
        text: String,
        rating: Number,
        dateAdded: Date
    }
});

module.exports = mongoose.model('Answer', answerScheme);/**
 * Created by Gligorije on 26.2.2017..
 */
