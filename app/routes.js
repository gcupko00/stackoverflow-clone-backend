var Question = require('./models/question');
var Answer = require('./models/answer');
var User = require('./models/user');
var cors = require('cors');
var jwt = require('../server.js');

module.exports = function(app) {
	app.use(cors());

	app.get('/question/:_id', function(req, res, next) {
		Question.findById(req.params._id, function (err, question){
            if (err) return console.error(err);
            question.local.views++;
            question.save();
		}).populate('local.answers').populate('local.user')
			.exec(function(err, q) {
            	if (err) return console.error(err);
                res.header('Content-Type', 'application/json');
                res.send("{\"data\": " + JSON.stringify(q) + "}");
			});
	});

	app.get('/top-questions', function(req, res, next) {
		Question.find({}, function (err, questions) {
			if (err) return console.error(err);
            res.header('Content-Type', 'application/json');
			res.send("{\"data\": " + JSON.stringify(questions) + "}")
        }).sort({'local.rating' : -1}).limit(4);
	});

	app.get('/questions/:criteria/:page', function(req, res, next) {
        res.header('Content-Type', 'application/json');
		if (req.params.criteria == 'new') {
            Question.find({}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).sort({'local.dateAdded' : -1}).skip((req.params.page - 1)*10).limit(10);
		}
		else if (req.params.criteria == 'top') {
            Question.find({}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).sort({'local.rating' : -1}).skip((req.params.page - 1)*10).limit(10);
		}
        else if (req.params.criteria == 'unanswered') {
            Question.find({'local.answersCount' : 0}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).sort({'local.date' : -1}).skip((req.params.page - 1)*10).limit(10);
        }
        else {
            Question.find({}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).skip((req.params.page - 1)*10).limit(10);
		}
	});

	app.get('/question-count/:criteria', function(req, res, next) {
        res.header('Content-Type', 'application/json');
		if(req.params.criteria == 'unanswered') {
            Question.count({'local.answersCount' : 0}, function (err, count) {
                if (err) return console.error(err);
                res.send("{ \"totalQuestionsCount\" : " + count + "}");
            });
        }
		else {
            Question.count({}, function (err, count) {
                if (err) return console.error(err);
                res.send("{ \"totalQuestionsCount\" : " + count + "}");
            });
        }
	});

	app.put('/question/:_id/rate', function(req, res, next) {
        Question.findById(req.params._id, function (err, question){
            if (err) return console.error(err);

            User.findById(req.body.user, function (err, user) {
                if (err) return console.error(err);
                user.local.ratedQuestions.push(question._id);
                user.save();
            });

            if (req.body.upDown >= 0) question.local.rating++;
            else question.local.rating--;
            question.save();
            res.sendStatus(200);
        });
	});

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

	app.post('/post-question', function(req, res, next) {
		var newQuestion = new Question();
		newQuestion.local.title        = req.body.title;
        newQuestion.local.description  = req.body.description;
		newQuestion.local.tags         = req.body.tags;
		newQuestion.local.rating       = req.body.rating;
		newQuestion.local.answersCount = req.body.answersCount;
		newQuestion.local.views        = req.body.views;
        newQuestion.local.user         = req.body.user._id;
		newQuestion.local.dateAdded    = Date.now();

		newQuestion.save(function(err) {
			if (err) throw err;
		});

        res.header('Content-Type', 'application/json');
        res.send("{\"data\": " + JSON.stringify(newQuestion) + "}");
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

	app.post('/signup', function(req, res) {
		var newUser = new User();
		newUser.local.username   = req.body.username;
        newUser.local.email      = req.body.email;
        newUser.local.password   = req.body.password;
        newUser.local.reputation = 0;

        User.findOne( { $or: [ {'local.email'    : newUser.local.email},
                               {'local.username' : newUser.local.username}]}, function (err, user) {
            if (user) {
                console.log('Username or email already taken');
                res.status(406).json('USER_EXISTS');
                return;
            } else {
                newUser.save(function(err) {
                    console.log('Saving user:\n' + newUser);
                    if (err) throw err;
                });

                var token = jwt.sign({ username: req.body.username }, 'test');
                res.status(200).json(token);
            }
        });
    });

    app.post('/login', function(req, res) {
        User.findOne({ 'local.email' : req.body.email}, '+password', function (err, user) {
            if (!user) {
                console.log('Cannot find user: ');
                res.status(401).json();
                return;
            } else if (user.local.password !== req.body.password) {
                console.log('Incorrect Password!');
                res.status(401).json();
                return;
            }

            console.log('Correct Password!');

            var token = jwt.sign({ username: user.local.username }, 'test');
            res.status(200).json({ token : token, username : user.local.username, _id: user._id });
        });
    });
};