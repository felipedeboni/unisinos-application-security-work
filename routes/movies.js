'use strict';

var express = require( 'express' );
var router = express.Router();

// GET /movies/
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Movies';
	res.rendr( 'movies/index' );
});

module.exports = router;
