var mongoose = require('mongoose');

var userScheme = mongoose.Schema({
    local: {
        username: String,
        email: String,
        password: String,
        imageUrl: String,
        reputation: Number
    }
});

module.exports = mongoose.model('User', userScheme);