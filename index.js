var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var uri = "mongodb://ehaley:Chr0n0k33p3r@ethanhaley-shard-00-00-n5zg9.mongodb.net:27017,ethanhaley-shard-00-01-n5zg9.mongodb.net:27017,ethanhaley-shard-00-02-n5zg9.mongodb.net:27017/test?ssl=true&replicaSet=EthanHaley-shard-0&authSource=admin";

var port = 1357;
var stylesheet = fs.readFileSync('public/app.css');
var app = express();

//Setup the express router to handle Handlebars templating automatically
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

//Begin routing function
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

app.get('/navbar.html', function(req, res) {
	res.render('navbar');
});

app.get('/home.html', function(req, res) {
	res.render('home');
});

app.get('/character.html', function(req, res) {
	res.render('character');
});

app.get('/characters.html', function(req, res) {
	MongoClient.connect(uri, function(err, db) {
		if(err) throw err;
		db.collection("characters").find({}).toArray(function(err, result) {
			if(err) throw err;
			var context = {};
			context.characters = result;
			res.render('characters', context)
			db.close();
		});
	});
});

app.get('/monsters.html', function(req, res) {
	MongoClient.connect(uri, function(err, db) {
		if(err) throw err;
		db.collection("characters").find({'class': 'Monster', 'race': 'Monster'}).toArray(function(err, result) {
			if(err) throw err;
			var context = {};
			context.characters = result;
			res.render('characters', context)
			db.close();
		});
	});
});

app.get('/encounter.html', function(req, res) {
	MongoClient.connect(uri, function(err, db) {
		if(err) throw err;
		db.collection("characters").find({}).toArray(function(err, result) {
			if(err) throw err;
			var context = {};
			context.characters = result;
			res.render('encounter', context)
			db.close();
		});
	});
});

app.get('/dice-modal.html', function(req, res) {
	res.render('dice-modal');
});

app.post('/editCharacter.html', function(req, res) {
	var request = req.body;
	if(!request.charId) { res.render('character') }
	else {
		MongoClient.connect(uri, function(err, db) {
			if(err) throw err;
			db.collection("characters").findOne({'_id': ObjectId(request.charId.toString())}, function(err, result) {
				if(err) throw err;
				res.render('character', result);
			});
		});
	}
});

app.post('/deleteCharacter.html', function(req, res) {
	var request = req.body;
	MongoClient.connect(uri, function(err, db) {
		if(err) throw err;
		db.collection("characters").deleteOne({'_id': ObjectId(request.charId.toString())}, function(err, result) {
			if(err) throw err;
			db.collection("characters").find({}).toArray(function(err, result) {
				if(err) throw err;
				console.log("1 character deleted");
				var context = {};
				context.characters = result;
				res.render('characters', context)
				db.close();
			});
		});
	});
});

app.post('/saveCharacter', function(req, res) {
	var request = req.body;
	if (request.id) {
		MongoClient.connect(uri, function(err, db) {
			if(err) throw err;
			db.collection("characters").updateOne({'_id': ObjectId(request.id.toString())}, 
				{
					$set: {
						'name': request.name,
						'hp': request.hp,
						'ac': request.ac,
						'speed': request.speed,
						'str': request.str,
						'dex': request.dex,
						'con': request.con,
						'int': request.int,
						'wis': request.wis,
						'char': request.char,
						'class': request.class,
						'race': request.race,
						'description': request.description,
						'proficiency': request.proficiency
					}
				}, function(err, result) {
					if(err) throw err;
					console.log("1 character edited");
					db.collection("characters").find({}).toArray(function(err, result) {
						if(err) throw err;
						var context = {};
						context.characters = result;
						res.render('characters', context)
						db.close();
					});
				});
		});
	}
	else {
		MongoClient.connect(uri, function(err, db) {
			if(err) throw err;
			var character = {
				name: request.name,
				hp: request.hp, 
				ac: request.ac,
				speed: request.speed,
				str: request.str,
				dex: request.dex,
				con: request.con,
				int: request.int,
				wis: request.wis,
				char: request.char,
				class: request.class,
				race: request.race,
				description: request.description,
				proficiency: request.proficiency,
				//image: request.image
			};
			db.collection("characters").insertOne(character, function(err, result) {
				if(err) throw err;
				console.log("1 character saved");
				db.collection("characters").find({}).toArray(function(err, result) {
					if(err) throw err;
					var context = {};
					context.characters = result;
					res.render('characters', context)
					db.close();
				});
			});
		});
	}
});

app.post('/startBattle', function(req, res) {
	var request = req.body;
	context = {};
	context.characters = [];
	for(key in request) {
		context.characters.push(request[key]);
	}
	res.render('battle', context);
});

app.post('/battle-template.html', function(req, res) {
	var request = req.body;
	MongoClient.connect(uri, function(err, db) {
		if(err) throw err;
		db.collection("characters").findOne({'_id': ObjectId(request.id.toString())}, function(err, result) {
			if(err) throw err;
			var character = result;
			character.index = request.index;
			res.render('battle-template', character);
		});
	});
});

app.listen(port, function() {
	console.log('App listening on port ' + port);
});