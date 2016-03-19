var db = require( '../db' );

exports.findById = findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM comments WHERE id = '" + id + "'", function( err, row ) {
			next( err, row );
		});
	});
};

exports.findAll = function( options, next ) {
	options = options || {};
	var query = 'SELECT comments.*, users.id as user_id, users.name as user_name FROM comments ';
	query += "INNER JOIN users ON users.id = comments.user_id";

	if ( options.WHERE ) {
		query += ' WHERE ' + options.where;
	}

	if ( options.orderBy ) {
		query += ' ORDER BY ' + options.orderBy;
	}

	if ( options.limit ) {
		query += ' LIMIT ' + options.limit;
	}

	db.serialize(function() {
		db.all( query, function( err, row ) {
			next( err, row );
		});
	});
};

exports.add = function( comment, next ) {
	var query = 'INSERT INTO comments (comment, movie_id, user_id, created_at, updated_at) ';
	query += "VALUES ('" + comment.comment + "','" + comment.movie_id + "','" + comment.user_id + "', datetime('now', 'localtime'), datetime('now', 'localtime'))";

	db.serialize(function() {
		db.run( query, [], next );
	});
};

exports.existsById = function( id, next ) {
	findById( id, function( err, row ) {
		if ( err ) {
			return next( err, false );
		}

		return next( null, !!row );
	});
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM comments WHERE id = ' + id;

	db.serialize(function() {
		db.run( query, [], next );
	});
};
