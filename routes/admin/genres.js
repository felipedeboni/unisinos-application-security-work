'use strict';

var express = require( 'express' );
var router = express.Router();
var Genre = require( '../../models/genre' );
var flash = require( '../../lib/flash' );

// GET /genres/
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Genres List';

	Genre.findAll({ orderBy: 'name ASC' }, function( err, genres ) {
		if (err) {
			return res.status( 500 );
		}

		res.vm.genres = genres;
		res.rendr( 'admin/genres/index' );
	});

});

// GET /genres/new
router.get( '/new', function( req, res, next ) {
	res.vm.title = 'New Genre';
	res.rendr( 'admin/genres/new' );
});

// POST /genres/new
router.post( '/new', function( req, res, next ) {
	Genre.add( req.body, function( err ) {
		if ( err ) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/genres/new' );
		}

		flash.success( req, 'Genre created.' );
		res.redirect( '/admin/genres/' );
	});
});

// GET /genres/:id/edit
router.get( '/:id(0-9+)/edit', [validateGenreExistance, function( req, res, next ) {
	Genre.findById( req.params.id, function( err, genre ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.vm.title = 'Edit Genre';
		res.vm.genre = genre;

		res.rendr( 'admin/genres/edit' );
	});
}]);

// POST /genres/:id/edit
router.post( '/:id(0-9+)/edit', [validateGenreExistance, function( req, res, next ) {
	var data = getFormData( req );

	Genre.updateById( req.params.id, data, function( err ) {
		if (err) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/genres/' + req.params.id + '/edit' );
		}

		flash.success( req, 'Genre updated.' );
		res.redirect( '/admin/genres/' );
	});
}]);

// GET /genres/:id/remove
router.get( '/:id([0-9]+)/remove', [validateGenreExistance, function( req, res, next ) {
	var data = getFormData( req );

	Genre.removeById( req.params.id, function( err ) {
		if (err) {
			flash.error( req, 'Unexpected error has occured.' );
			return res.redirect( '/admin/genres/' );
		}

		flash.success( req, 'Genre removed.' );
		res.redirect( '/admin/genres' );
	});
}])

function getFormData( req, blacklist ) {
	var data = {};
	blacklist = blacklist || [];

	var fields = [ 'name' ];

	for ( var i in fields ) {
		var field = fields[ i ];

		if ( blacklist.indexOf( field ) === -1 && typeof req.body[ field ] !== 'undefined' ) {
			data[ field ] = req.body[ field ];
		}
	}

	return data;
}

function validateGenreExistance( req, res, next ) {
	Genre.existsById( req.params.id, function( err, exists ) {
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
