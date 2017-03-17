var cors = require('cors');
var crypto = require('crypto');
var User = require('.././models/user');
var jwt = require('../../server.js');

module.exports = function(app) {
    app.use(cors());
    const secret = 'Tentacle';
    const fixedSalt = '4Chan';

    app.post('/signup', function(req, res) {
        var newUser = new User();
        newUser.username   = req.body.username;
        newUser.email      = req.body.email;
        newUser.reputation = 0;
        newUser.imageUrl   = "/assets/profile.png";
        newUser.password = crypto.createHmac('sha256', newUser.email + secret)
            .update(req.body.password + fixedSalt)
            .digest('hex');

        User.findOne( { $or: [ {'email' : newUser.email},
            {'username' : newUser.username}]}, function (err, user) {
            if (user) {
                console.log('Username or email already taken');
                res.status(406).json('USER_EXISTS');
            } else {
                newUser.save(function(err) {
                    console.log('Saving user:\n' + newUser.username);
                    if (err) throw err;
                });

                var token = jwt.sign({ username: req.body.username }, 'test');
                res.status(200).json({token : token, user : newUser});
            }
        });
    });

    app.get('/users', function (req, res) {
        User.find({}, function (err, users) {
            if (err) return console.error(err);
            res.header('Content-Type', 'application/json');
            res.status(200).send("{\"data\": " + JSON.stringify(users) + "}")
        });
    });

    app.post('/login', function(req, res) {
        User.findOne({ $or: [ {'email' : req.body.email},
            {'username' : req.body.email}]}, '+password', function (err, user) {
            if (!user) {
                console.log('Cannot find user: ');
                return res.status(401).json();
            }

            var password = crypto.createHmac('sha256', user.email + secret)
                .update(req.body.password + fixedSalt)
                .digest('hex');

            if (user.password !== password) {
                console.log('Incorrect Password!');
                return res.status(401).json();
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
            if (err) return res.status(500).send({ error: err });
            return res.status(200).json({ user : user });
        });
    });

    app.post('/deleteUser', function(req, res) {
        console.log();
        var query = { username: req.body.username };
        User.findOneAndRemove(query, function (err, user) {
            if (err) {
                console.log(err);

                console.log(query);
                console.log('User' + req.body + ' not found.');
                console.log(user);
                return res.status(400).send({ error: err });
            }

            console.log('Deleted user: ' + req.body);
            return res.status(200).json();
        });
    });
};