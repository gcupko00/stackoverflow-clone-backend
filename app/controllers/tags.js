var Question = require('.././models/question');
var Answer = require('.././models/answer');
var User = require('.././models/user');
var Tag = require('.././models/tag');
var cors = require('cors');

module.exports = function(app) {
    app.use(cors());

    app.post('/post-tag', function (req, res) {
        var newTag = new Tag();
        newTag.name = req.body.name;
        newTag.description = req.body.description;
        newTag.questionCount = 0;

        Tag.findOne({'name' : newTag.name}, function (err, tag) {
            if (tag) {
                res.status(406).json('TAG_EXISTS');
            }
            else {
                newTag.save(function (err, tag) {
                    if (err) throw err;
                    res.header('Content-Type', 'application/json');
                    res.status(200).send("{\"data\": " + JSON.stringify(tag) + "}");
                })
            }
        });
    });

    app.get('/tag/:name', function (req, res) {
        Tag.findOne({'name' : req.params.name}, function (err, tag) {
            if (err) res.status(500).send();
            else if(tag) {
                res.header('Content-Type', 'application/json');
                res.status(200).send("{\"data\": " + JSON.stringify(tag) + "}");
            }
            else res.status(204).send();
        })
    });

    app.post('/tags/:page', function (req, res) {
        Tag.find({ name: {$regex : "^" + req.body.filter}}, function (err, tags) {
            if (err) return console.error(err);
            res.header('Content-Type', 'application/json');
            res.send("{\"data\": " + JSON.stringify(tags) + "}")
        }).skip((req.params.page - 1) * 30).limit(30);
    });
};