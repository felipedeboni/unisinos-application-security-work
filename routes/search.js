'use strict';

var express = require( 'express' );
var router = express.Router();
var Movie = require( '../models/movie' );

// GET home
router.get( '/', function( req, res, next ) {
	if ( !req.query.term && req.query.term.trim().length === 0 ) {
		return res.redirect( '/' );
	}
	var query = {
		where: "name LIKE $term",
		orderBy: 'name ASC',
		params: {
			$term: '%' + req.query.term + '%'
		}
	};

	Movie.findAll( query, function( err, movies ) {
		res.vm.movies = movies;
		res.rendr( 'search/index' );
	});

});

module.exports = router;
