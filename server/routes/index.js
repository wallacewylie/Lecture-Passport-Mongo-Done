var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../../models/user');


router.get('/', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/success', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/success.html'));
});

router.get('/failure', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/fail.html'));
});

router.get('/register', function(request, response){
	response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', passport.authenticate('local', {
	successRedirect: '/success', failureRedirect:'/failure'
}));

router.post('/registerMe', function(request, response){
	User.create(request.body, function(err, post){
		if(err) {
			next(err);
		} else {
			response.redirect('/success');
		}
	})
});


module.exports = router;