var fs = require('fs');
var http = require('http');
var express = require('express');

var port = 8080;
var stylesheet = fs.readFileSync('public/app.css');
var app = express();

app.set('view engine', 'html');
app.engine('html', require('hbs')._express);

app.get('/', function(req, res) {
	fs.readFile('public/index.html', function(err, body) {
		res.end(body);
	});
});

app.get('/app.js', function(req, res) {
	fs.readFile('public/app.js', function(err, body) {
		res.end(body);
	});
});

app.get('/app.css', function(req, res) {
	res.setHeader('Content-Type', 'text/css');
	res.end(stylesheet);
});


app.listen(port, function() {
	console.log('App listening on port ' + port);
});