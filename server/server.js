var express = require('express');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var User = require('../models/user');

var app = express();
var localStrategy = require('passport-local').Strategy;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized: false,
	cookie: {maxAge: 60000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

//Mongo Things

var mongoURI = 'mongodb://localhost:27017/passport_mongo';
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
	console.log('MongoDB error: ', err);
});

mongoDB.on('open', function(){
	console.log('MongoDB connected!');
});

//Passport Things

passport.serializeUser(function(user, done){

	console.log('Serialize ran');

	//Place ID on session, so we can get user back

	console.log(user.id, user._id);
	done(null, user.id);
});

passport.deserializeUser(function(user, done){

	console.log('Deserialize ran');

	//Go get User object to put on req.user

	User.findById(user.id, function(err, user){
		if(err){
			done(err);
		}
		done(null, user); //req.user
	})
});

passport.use('local', new localStrategy({
	passReqToCallback:true, usernameField: 'username'},
		function(req, username, password, done){

			//Checking the password

			User.findOne({username: username}, function(err, user){
				if(err){
					console.log(err);
				}

				if(!user){
					done(null, false);
				}

				user.comparePassword(password, function(err, isMatch){
					if(err){
						console.log(err);
					}

					if(isMatch){
						done(null, user); //success
					} else {
						done(null, false); //fail
					}
				})
			})
}));

var server = app.listen(3000, function(){
	var port = server.address().port;
	console.log('Listening on port', port);
});