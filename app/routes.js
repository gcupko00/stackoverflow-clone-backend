var Question = require('./models/question');
var cors = require('cors');

module.exports = function(app) {
	app.use(cors());

	app.get('/question/:_id', function(req, res, next){
		Question.findById(req.params._id, function (err, question){
			if (err) return console.error(err);
			res.send("{\"data\": " + JSON.stringify(question) + "}");
		});
	});

	app.get('/top-questions', function(req, res, next){
		Question.find({}, function (err, questions) {
			if (err) return console.error(err);
			res.send("{\"data\": " + JSON.stringify(questions) + "}")
        }).sort({'local.rating' : -1}).limit(4);
	});

	app.get('/questions/:page', function(req, res, next){
		Question.find({}, function (err, questions) {
			if (err) return console.error(err);
            res.send("{\"data\": " + JSON.stringify(questions) + "}")
		}).skip((req.params.page - 1)*10).limit(10);
	});

	app.get('/question-count', function(req, res, next) {
        Question.count({}, function(err, count){
            if (err) return console.error(err);
            res.send("{ \"totalQuestionsCount\" : " + count + "}" );
        });
	});

	app.post('/post-question', function(req, res, next){
		var newQuestion = new Question();
		newQuestion.local.title = req.body.title;
        newQuestion.local.description = req.body.description;
		newQuestion.local.tags = req.body.tags;
		newQuestion.local.rating = req.body.rating;
		newQuestion.local.answers = req.body.answers;
		newQuestion.local.views = req.body.views;

		newQuestion.save(function(err) {
			if (err) throw err;
		});

		res.sendStatus(200);
		// todo: when question page is finished at front end, redirect to posted question
	});
};