'use strict';

var express = require( 'express' );
var router = express.Router();

// GET /genres/
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Genres';
	res.rendr( 'genres/index' );
});

module.exports = router;
