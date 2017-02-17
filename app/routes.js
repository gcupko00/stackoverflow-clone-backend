var Question = require('./models/question');

module.exports = function(app) {
	app.post('/post-question', function(req, res){
		
	});
	
	app.get('/question/:_id', function(req, res){
		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		// res.setHeader('Access-Control-Allow-Credentials', true);
		// find by id
		Question.findById(req.params._id, function (err, question){
			if (err) return console.error(err);
			res.send("{\"data\": " + JSON.stringify(question) + "}");
		});
		// res.send(question.title)
	});
}