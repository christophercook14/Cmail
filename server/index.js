var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser')
var db = require('./models').db;
var User = require('./models').User;
var Email = require('./models').Email;

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.static(path.join(__dirname, '/../browser')));
app.use(express.static(path.join(__dirname, '/../node_modules')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/api', require('./routes'));


app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, '/../browser/index.html'));
});



app.listen(3000);
