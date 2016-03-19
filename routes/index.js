'use strict';

var express = require( 'express' );
var router = express.Router();
var Movie = require( '../models/movie' );

// GET home
router.get( '/', function( req, res, next ) {

	Movie.findAll({ orderBy: 'name ASC', limit: '12' }, function( err, movies ) {
		res.vm.movies = movies;
		res.rendr( 'index' );
	});
});

// GET 404
router.get( '/404', function( req, res, next ) {
	res.rendr( '404' );
});

module.exports = router;
