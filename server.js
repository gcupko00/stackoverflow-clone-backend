var mongoose = require('mongoose');
var configDB = require('./config/database.js');

var express = require('express');
var app = express();
const port = 3000;

mongoose.connect(configDB.url);

mongoose.connection
	.once('open', () => console.log('Connection open!'))
	.on('error', (error) => console.warn('Warning', error));


// app.get('/questions', function (req, res, next) {
  // res.send("{\"data\":{\"title\":\"Lorem ipsum question\",\"description\":\"Lorem ipsum dolor sit amet, interdum nulla, nec quam, feugiat nisl. Ac lacinia, a in. Penatibus sit suscipit, vel nam. Et praesent parturient, pharetra nunc mauris. Id arcu.\",\"date\":\"13-11-2016\",\"tags\":[\"c#\",\"mvc\",\"asp.net\"],\"rating\":\"23\",\"answers\":\"2\",\"views\":\"189\"}}");
// })

require('./app/routes.js')(app);

app.listen(port);