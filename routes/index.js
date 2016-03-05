'use strict';

var express = require( 'express' );
var router = express.Router();

// GET home
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Home';
	res.rendr( 'index' );
});

module.exports = router;
