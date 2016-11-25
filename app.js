'use strict'

// Require
let express = require('express');
let path = require('path');
let app = express();
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cookieSession = require('cookie-session');
let firebase = require('firebase');

// Firebase
let config = {
apiKey: "AIzaSyDZl2Ps7KNmayxkdmqHufaUxLZKpg2xCnY",
authDomain: "hangman-76d8e.firebaseapp.com",
databaseURL: "https://hangman-76d8e.firebaseio.com",
storageBucket: "",
messagingSenderId: "16825731274"
};
firebase.initializeApp(config);

// Views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({secret: 'app_1'}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res) {
	res.clearCookie('player');
	res.clearCookie('words');
    res.render('index');
});
app.get('/winner', function(req, res) {
	res.render('winner');
});
app.get('/looser', function(req, res) {
	res.render('looser');
});
app.get('/add',function(req, res) {
	res.render('addWord');
});
app.post('/add', function(req, res) {
	let word	=	req.body.word;
	let snap, total = 0;

	firebase.database().ref('words').on('value', function(snapshot) {
		snap = snapshot.val();
		total = Object.keys(snap).length;
		total++;

		firebase.database().ref('words/w' + total).set({'word': word});
	}, function(error){ console.log("The read failed: " + error.code)});

	res.render('addWord', {added: true});
});
app.all('/round', function(req, res) {
	let player	=	req.body.player;
	let snap;
	let words = [];

	res.cookie('player', player );

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function getRandomKey(total) {
		let number = getRandomInt(1, total);
		let id = 'w' + number;
		let word = snap['w'+number].word;
		return word;
	}

	firebase.database().ref('words').on('value', function(snapshot) {
		snap = snapshot.val();
		let total = Object.keys(snap).length;

		for (let i = 0; i < 3; i++) {
			let word = getRandomKey(total);
			if (words.indexOf(word) != -1) { i--; } else { words.push(word); }
		}

		res.cookie('words', words);
		res.render('round');
	}, function(error){ console.log("The read failed: " + error.code)});
});

// Start the listen server
app.listen(3000);
console.log('App now running at: http://127.0.0.1:3000/');