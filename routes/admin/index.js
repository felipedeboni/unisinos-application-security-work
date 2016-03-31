'use strict';

var express = require( 'express' );
var router = express.Router();

// admin home
router.get( '/', function( req, res, next) {
	res.rendr( 'admin/index' );
});

module.exports = router;
