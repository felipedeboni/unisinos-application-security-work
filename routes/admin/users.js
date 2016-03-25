'use strict';

var express = require( 'express' );
var router = express.Router();
var User = require( '../../models/user' );
var flash = require( '../../lib/flash' );

// GET /users/
router.get( '/', function( req, res, next ) {
	User.findAll(function( err, users ) {
		if ( err ) {
			return res.status( 500 ).send();
		}

		res.vm.title = 'Users List';
		res.vm.users = users;

		res.rendr( 'admin/users/index' );
	});
});

// GET /users/new
router.get( '/new', function( req, res, next ) {
	res.vm.title = 'New User';
	res.rendr( 'admin/users/new' );
});

// POST /users/new
router.post( '/new', function( req, res, next ) {
	User.add( req.body, function( err ) {
		if ( err ) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/users/new' );
		}

		flash.success( req, 'User created.' );
		res.redirect( '/admin/users/' );
	});
});

// GET /users/:id/edit
router.get( '/:id([0-9]+)/edit', [validateUserExistance, function( req, res, next ) {
	User.findById( req.params.id, function( err, user ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.vm.title = 'Edit User';
		res.vm.user = user;

		res.rendr( 'admin/users/edit' );
	});
}]);

// POST /users/:id/edit
router.post( '/:id([0-9]+)/edit', [validateUserExistance, function( req, res, next ) {
	var data = getFormData( req );

	User.updateById( req.params.id, data, function( err ) {
		if (err) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/users/' + req.params.id + '/edit' );
		}

		flash.success( req, 'User updated.' );
		res.redirect( '/admin/users/' );
	});
}]);

// GET /users/:id/remove
router.get( '/:id([0-9]+)/remove', [validateUserExistance, function( req, res, next ) {
	var data = getFormData( req );

	User.removeById( req.params.id, function( err ) {
		if (err) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/users/' );
		}

		flash.success( req, 'User removed.' );
		res.redirect( '/admin/users/' );
	});
}])

function getFormData( req, blacklist ) {
	var data = {};
	blacklist = blacklist || [];

	var fields = [ 'name', 'email', 'phone', 'is_admin', 'password' ];

	for ( var i in fields ) {
		var field = fields[ i ];

		if ( blacklist.indexOf( field ) === -1 && typeof req.body[ field ] !== 'undefined' ) {
			data[ field ] = req.body[ field ];
		}
	}

	return data;
}

function validateUserExistance( req, res, next ) {
	User.existsById( req.params.id, function( err, exists ) {
		if (err) {
			return res.status( 500 ).send();
		}

		if ( !exists ) {
			return res.status( 404 ).send();
		}

		next();
	});
}

module.exports = router;
