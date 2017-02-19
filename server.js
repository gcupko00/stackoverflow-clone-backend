var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();
const port = 3000;

mongoose.connect(configDB.url);

mongoose.connection
	.once('open', () => console.log('Connection open!'))
	.on('error', (error) => console.warn('Warning', error));


app.use(bodyParser.json());

require('./app/routes.js')(app);

app.listen(port);