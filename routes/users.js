'use strict';

var express = require( 'express' );
var auth = require( '../lib/auth' );
var router = express.Router();
var User = require( '../models/user' );

// GET home
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Home';
	res.rendr( 'index' );
});

router.get( '/profile', function( req, res, next ) {
	if ( !auth.isAuth(req) ) {
		return res.redirect( '/' );
	}

	User.findById( req.session.user_id, function( err, user ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.vm.user = user;

		res.rendr( 'users/profile' );
	});
});

router.post( '/profile', function( req, res, next ) {
	var data = req.body;
	delete data.is_admin;

	User.updateById( req.session.user_id, data, function( err ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.redirect( '/profile' );
	});
})

// POST /signin
router.post( '/signin', function( req, res, next ) {
	var email = req.body.email;
	var password = req.body.password;

	auth.login( req, email, password, function( isLogged ) {
		return res.redirect( '/' );
	});
});

// GET /signup
router.get( '/signup', function( req, res, next ) {
	res.rendr( 'users/new' );
});

// POST /signup
router.post( '/signup', function( req, res, next ) {
	var data = req.body;
	data.is_admin = [0];

	User.add( data, function( err ) {
		if ( err ) {
			return res.status( 500 ).send();
		}

		auth.setLogin( req, this.lastID );

		res.redirect( '/' );
	});
});

// GET /logout
router.get( '/logout', function( req, res, next ) {
	auth.logout( req );
	res.redirect( '/' );
});

module.exports = router;
