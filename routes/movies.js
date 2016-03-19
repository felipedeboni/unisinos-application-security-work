'use strict';

var express = require( 'express' );
var fs = require( 'fs' );
var path = require( 'path' );
var router = express.Router();

var Movie = require( '../models/movie' );
var Genre = require( '../models/genre' );


// GET /movies/:id/
router.get( '/:id', [validateMovieExistance, getGenres, function( req, res, next ) {
	Movie.findById( req.params.id, function( err, movie ) {
		if (err) {
			return res.redirect( '/404' );
		}

		res.vm.movie = movie;

		res.rendr( 'movies/index' );
	});
}]);

function getGenres( req, res, next ) {
	Genre.findAll({ order: 'name ASC' }, function( err, genres ) {

		res.vm.genres = genres;

		next();
	});
}

function validateMovieExistance( req, res, next ) {
	Movie.existsById( req.params.id, function( err, exists ) {
		if (err) {
			return res.status( 500 ).send();
		}

		if ( !exists ) {
			//return res.redirect( '/404' );
			// TODO check this
		}

		next();
	});
}

module.exports = router;
