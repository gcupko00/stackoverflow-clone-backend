var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken')

var express = require('express');
var app = express();
const port = 3000;

mongoose.connect(configDB.url);

mongoose.connection
	.once('open', () => console.log('Connection open!'))
	.on('error', (error) => console.warn('Warning', error));


app.use(bodyParser.json());

/* Regex doesn't use quotes and is required for '/question/:page' and similar */
var noJwtPaths = [
	'/login',
	'/signup',
	'/top-questions',
	/\/questions\/*/,
	/\/questions\/*\/*/,
	/\/question\/*/,
	'/question-count',
	/\/answers\/*/,
	'/answers',
	/\/tags\/*/,
    /\/tag\/*/,
    /\/search\/*/,
    /\/short-search\/*/];
app.use(expressJWT({ secret: 'test' }).unless({ path: noJwtPaths}));

module.exports = jwt;
require('./app/controllers/questions')(app);
require('./app/controllers/answers')(app);
require('./app/controllers/tags')(app);
require('./app/controllers/users')(app);
require('./app/controllers/search')(app);

app.listen(port);