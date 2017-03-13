var Question = require('.././models/question');
var Answer = require('.././models/answer');
var User = require('.././models/user');
var Tag = require('.././models/tag');
var cors = require('cors');

module.exports = function(app) {
    app.use(cors());

    app.get('/answers/:_id', function(req, res, next) {
        Question.findById(req.params._id)
            .populate('local.answers')
            .exec(function(err, q) {
                if (err) return console.error(err);
                res.header('Content-Type', 'application/json');
                res.send("{\"data\": " + JSON.stringify(q.local.answers) + "}");
            });
    });

    app.put('/answers/:_id/rate', function(req, res, next) {
        Answer.findById(req.params._id, function (err, answer){
            if (err) return console.error(err);
            if (req.body.upDown >= 0) answer.rating++;
            else answer.rating--;
            answer.save();
            res.sendStatus(200);
        });
    });

    app.post('/post-answer/', function(req, res, next) {
        Question.findById(req.body._question, function (err, question){
            if (err) return console.error(err);

            var newAnswer = new Answer({
                '_question': question._id,
                '_user': req.body.user._id,
                'text': req.body.text,
                'rating': 0,
                'dateAdded': Date.now()
            });

            newAnswer.save();

            question.local.answers.push(newAnswer._id);
            question.local.answersCount++;

            question.save();

            res.header('Content-Type', 'application/json');
            res.send("{\"data\": " + JSON.stringify(newAnswer) + "}");
        });
    });
};