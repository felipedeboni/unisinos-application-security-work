'use strict';

var express = require( 'express' );
var router = express.Router();

// GET /users/
router.get( '/', function( req, res, next ) {
	res.vm.title = 'Users';
	res.rendr( 'users/index' );
});

module.exports = router;
