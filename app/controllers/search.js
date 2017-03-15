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
            if (questions.size == 0)
                res.status(204).send();
            else {
                res.header('Content-Type', 'application/json');
                res.send("{\"data\": " + JSON.stringify(questions) + "}");
            }
        }).limit(10);
    });

    app.get('/search/questions/:queryString/:page', function (req, res) {
        var query = {$text: {$search: "\"" + req.params.queryString + "\""}};
        Question.find(query, function (err, questions) {
            if (err) return console.error(err);
            if (questions.size == 0)
                res.status(204).send();
            else {
                res.header('Content-Type', 'application/json');
                res.send("{\"data\": " + JSON.stringify(questions) + "}");
            }
        }).skip((req.params.page - 1) * 10).limit(10);
    });
};