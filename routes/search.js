'use strict';

var express = require( 'express' );
var router = express.Router();
var Movie = require( '../models/movie' );

// GET home
router.get( '/', function( req, res, next ) {
	var where = "name LIKE '%" + req.query.term + "%'";

	Movie.findAll({ where: where, orderBy: 'name ASC', limit: '12' }, function( err, movies ) {
		res.vm.movies = movies;
		res.rendr( 'search/index' );
	});

});

module.exports = router;
