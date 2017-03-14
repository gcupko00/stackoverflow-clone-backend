var Question = require('.././models/question');
var Answer = require('.././models/answer');
var User = require('.././models/user');
var Tag = require('.././models/tag');
var cors = require('cors');

module.exports = function(app) {
    app.use(cors());

    app.get('/short-search/:queryString', function (req, res) {
        var query = {$text: {$search: "\"" + req.params.queryString + "\""}};
        Question.find(query, function (err, questions) {
            if (err) return console.error(err);

            Tag.find(query, function (err, tags) {
                if (err) return console.error(err);

                User.find(query, function (err, users) {
                    if (err) return console.error(err);

                    res.header('Content-Type', 'application/json');
                    res.send("{\"questions\": "
                        + JSON.stringify(questions)
                        + ",\"tags\": " + JSON.stringify(tags)
                        + ",\"users\": " + JSON.stringify(users)
                        + "}")
                }).limit(2);
            }).limit(3);
        }).limit(5);
    })
};