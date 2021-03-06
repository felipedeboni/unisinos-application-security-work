'use strict';

var express = require( 'express' );
var auth = require( '../lib/auth' );
var flash = require( '../lib/flash' );
var router = express.Router();
var User = require( '../models/user' );

// GET home
router.get( '/', function( req, res, next ) {
	res.rendr( 'index' );
});

router.get( '/profile', function( req, res, next ) {
	if ( !auth.isAuth(req) ) {
		return res.redirect( '/' );
	}

	User.findById( req.session.user_id, function( err, user ) {
		if (err) {
			return res.redirect( '/404' );
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
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/profile' );
		}

		res.redirect( '/profile' );
	});
})

// GET /signin
router.get( '/signin', function( req, res, next ) {
	res.rendr( 'users/signin' );
});

// POST /signin
router.post( '/signin', function( req, res, next ) {
	var email = req.body.email;
	var password = req.body.password;

	auth.login( req, email, password, function( isLogged ) {
		if ( !isLogged ) {
			flash.error( req, 'Invalid email or password.' );
			res.vm.user = {
				email: email
			};
			res.rendr( 'users/signin' );
		} else {
			return res.redirect( '/' );
		}

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

	var validation = utils.validateUser( data, true, true );

	if ( !validation.isValid ) {
		flash.error( req, validation.message );
		delete data.password;
		delete data.password_confirm;

		res.vm.user = data;
		return res.rendr( 'users/new' );
	}

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
