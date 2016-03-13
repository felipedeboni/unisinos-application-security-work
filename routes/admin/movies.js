'use strict';

var express = require( 'express' );
var fs = require( 'fs' );
var path = require( 'path' );
var router = express.Router();
var multer = require( 'multer' );
var upload = multer({ dest: 'uploads/' });

var Movie = require( '../../models/movie' );
var Genre = require( '../../models/genre' );

// GET /movies/
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Movies List';

	Movie.findAll( {}, function( err, movies ) {
		if (err) {
			return res.status( 500 );
		}

		res.vm.movies = movies;
		res.rendr( 'admin/movies/index' );
	});

});

// GET /movies/new
router.get( '/new', [getGenres, function( req, res, next ) {
	res.vm.title = 'New Movie';
	res.rendr( 'admin/movies/new' );
}]);

// POST /movies/new
router.post( '/new', upload.single('cover'), function( req, res, next ) {
	Movie.add( req.body, function( err ) {
		if ( err ) {
			return res.status( 500 ).send();
		}

		if ( req.file ) {
			fs.rename(
				path.join( process.cwd(), 'uploads', req.file.filename ),
				path.join( process.cwd(), 'public', 'images', 'movies', this.lastID.toString() + '.' + req.file.mimetype.split('/').reverse()[0] )
			);
		}


		res.redirect( '/admin/movies/' + this.lastID + '/edit' );
	});
});

// GET /movies/:id/edit
router.get( '/:id/edit', [validateMovieExistance, getGenres, function( req, res, next ) {
	Movie.findById( req.params.id, function( err, movie ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.vm.title = 'Edit Movie';
		res.vm.movie = movie;

		res.rendr( 'admin/movies/edit' );
	});
}]);

// POST /movies/:id/edit
router.post( '/:id/edit', [validateMovieExistance, getGenres, upload.single('cover'), function( req, res, next ) {
	var data = getFormData( req );

	Movie.updateById( req.params.id, data, function( err ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.redirect( '/admin/movies/' + req.params.id + '/edit' );
	});
}]);

// GET /movies/:id/remove
router.get( '/:id/remove', [validateMovieExistance, function( req, res, next ) {
	var data = getFormData( req );

	Movie.removeById( req.params.id, function( err ) {
		if (err) {
			return res.status( 500 ).send();
		}

		res.redirect( '/admin/movies' );
	});
}])

function getGenres( req, res, next ) {
	Genre.findAll({ order: 'name ASC' }, function( err, genres ) {

		res.vm.genres = genres;

		next();
	});
}

function getFormData( req, blacklist ) {
	var data = {};
	blacklist = blacklist || [];

	var fields = [ 'name', 'synopsis', 'release_date', 'genre_ids' ];

	for ( var i in fields ) {
		var field = fields[ i ];

		if ( blacklist.indexOf( field ) === -1 && typeof req.body[ field ] !== 'undefined' ) {
			data[ field ] = req.body[ field ];
		}
	}

	return data;
}

function validateMovieExistance( req, res, next ) {
	Movie.existsById( req.params.id, function( err, exists ) {
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
