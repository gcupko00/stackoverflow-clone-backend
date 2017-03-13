var Question = require('.././models/question');
var Answer = require('.././models/answer');
var User = require('.././models/user');
var Tag = require('.././models/tag');
var cors = require('cors');
var jwt = require('../../server.js');

module.exports = function(app) {
    app.use(cors());

    app.post('/signup', function(req, res) {
        var newUser = new User();
        newUser.username   = req.body.username;
        newUser.email      = req.body.email;
        newUser.password   = req.body.password;
        newUser.reputation = 0;
        newUser.imageUrl   = "/assets/profile.png"

        User.findOne( { $or: [ {'email'    : newUser.email},
            {'username' : newUser.username}]}, function (err, user) {
            if (user) {
                console.log('Username or email already taken');
                res.status(406).json('USER_EXISTS');
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
        User.findOne({ 'email' : req.body.email}, '+password', function (err, user) {
            if (!user) {
                console.log('Cannot find user: ');
                res.status(401).json();
                return;
            } else if (user.password !== req.body.password) {
                console.log('Incorrect Password!');
                res.status(401).json();
                return;
            }

            console.log('Correct Password!');

            var token = jwt.sign({ username: user.username }, 'test');
            res.status(200).json({ token : token, user : user });
        });
    });

    app.post('/updateImgUrl', function(req, res) {
        var query = { username: req.body.username };
        var update = { imageUrl: req.body.imgUrl };
        var options = { new: false };
        User.findOneAndUpdate(query, update, options, function (err, user) {
            if (err) return res.send(500, { error: err });
            return res.status(200).json({ user : user });
        });
        /*
         var query = {'username':req.body.username};
         req.body.imgUrl = req.user.username;
         User.findAndModify(query, req.newData, function(err, doc){
         if (err) return res.send(500, { error: err });
         return res.send(200, "succesfully saved");
         });

         db.getCollection('users').findAndModify({
         query: { username: "karlo" },
         update: { $set: { imageUrl: "aaaa" } }
         });*/
    });
};