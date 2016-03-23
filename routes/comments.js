'use strict';

var express = require( 'express' );
var router = express.Router({ mergeParams: true });
var Comment = require( '../models/comment' );

// GET /comments/
router.get( '/movies/:id/comments', function( req, res, next ) {
	var query = {
		where: 'movie_id = ' + req.params.id
	};

	Comment.findAll( query, function( err, comments ) {
		if (err) {
			return res.status( 500 ).send();
		}

		return res.json( comments );
	});
});

// POST /comments/new
router.post( '/movies/:id/comments/new', function( req, res, next ) {
	var comment = {};
	comment.comment = req.body.comment;
	comment.user_id = req.session.user_id;
	comment.movie_id = req.params.id;

	Comment.add(comment, function( err, success ) {
		if ( err ) {
			return res.status( 500 ).send();
		}

		res.json({
			success: true,
			comment: {
				id: this.lastID,
				comment: comment.comment,
				user_id: req.currentUser.id,
				user_name: req.currentUser.name,
				movie_id: comment.movie_id
			}
		});
	});
});

// POST /comments/:id/remove
router.post( '/comments/remove', [verifyCommentOwnership, function( req, res, next ) {
	Comment.removeById( req.body.id, function( err ) {
		if ( err ) {
			return res.status( 500 ).send();
		}

		res.json({ success: true });
	});
}]);

function validateMovieExistance( req, res, next ) {
	Movie.existsById( req.params.movie_id, function( err, exists ) {
		if (err) {
			return res.status( 500 ).send();
		}

		if ( !exists ) {
			return res.status( 404 ).send();
		}

		next();
	});
}

function verifyCommentOwnership( req, res, next ) {
	return next(); // lets make it insecure!

	Comment.findById( req.body.id, function( err, comment ) {
		if (err) {
			return res.status( 500 ).send();
		}

		if ( !comment ) {
			return res.status( 404 ).send();
		}

		if ( comment.user_id === req.currentUser.id ) {
			return res.status( 403 ).send();
		}

		next();
	});
};

module.exports = router;
