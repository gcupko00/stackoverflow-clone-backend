var Question = require('./models/question');
var Answer = require('./models/answer');
var User = require('./models/user');
var cors = require('cors');

module.exports = function(app) {
	app.use(cors());

	app.get('/question/:_id', function(req, res, next) {
		Question.findById(req.params._id, function (err, question){
            if (err) return console.error(err);
            question.local.views++;
            question.save();
		}).populate('local.answers')
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
            }).sort({'local.date' : -1}).skip((req.params.page - 1)*10).limit(10);
		}
		else if (req.params.criteria == 'top') {
            Question.find({}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).sort({'local.rating' : -1}).skip((req.params.page - 1)*10).limit(10);
		}
        else if (req.params.criteria == 'unanswered') {
            Question.find({}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).sort({'local.date' : -1}).skip((req.params.page - 1)*10).limit(10);
        }
        else {
            Question.find({'local.answers' : 0}, function (err, questions) {
                if (err) return console.error(err);
                res.send("{\"data\": " + JSON.stringify(questions) + "}")
            }).skip((req.params.page - 1)*10).limit(10);
		}
	});

	app.get('/question-count/:criteria', function(req, res, next) {
        res.header('Content-Type', 'application/json');
		if(req.params.criteria == 'unanswered') {
            Question.count({'local.answers' : 0}, function (err, count) {
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

	app.post('/post-question', function(req, res, next) {
		var newQuestion = new Question();
		newQuestion.local.title = req.body.title;
        newQuestion.local.description = req.body.description;
		newQuestion.local.tags = req.body.tags;
		newQuestion.local.rating = req.body.rating;
		newQuestion.local.answersCount = req.body.answersCount;
		newQuestion.local.views = req.body.views;
		newQuestion.local.dateAdded = Date.now();

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

	app.post('/signup', function(req, res, next) {
		var newUser = new User();
		newUser.local.username = req.body.username;
        newUser.local.email = req.body.email;
        newUser.local.password = req.body.password;
        newUser.local.reputation = 0;

        console.log(newUser);

        newUser.save(function(err) {
            if (err) throw err;
        });

        res.send("{\"data\": " + JSON.stringify(newUser) + "}");
    });
};