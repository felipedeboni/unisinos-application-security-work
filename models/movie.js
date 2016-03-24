var db = require( '../db' );

var findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM movies WHERE id = '" + id + "'", function( err, row ) {
			next( err, row );
		});
	});
};

exports.findById = findById;

exports.findAll = function( options, next ) {
	options = options || {};
	var query = 'SELECT * FROM movies';

	if ( options.where ) {
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

exports.add = function( movie, next ) {
	var query = 'INSERT INTO movies (name, synopsis, release_date, genre_ids, rate, created_at, updated_at) ';
	query += "VALUES ('" + movie.name + "','" + movie.synopsis + "','" + movie.release_date + "','" + movie.genre_ids + "','" + movie.rate + "', datetime('now', 'localtime'), datetime('now', 'localtime'))";

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

exports.updateById = function( id, movie, next ) {
	var sets = [];
	var query = 'UPDATE movies ';
	query += "SET ";

	if ( typeof movie.name !== 'undefined' ) {
		sets.push(
			"name = '" + movie.name + "'"
		);
	}

	if ( typeof movie.synopsis !== 'undefined' ) {
		sets.push(
			"synopsis = '" + movie.synopsis + "'"
		);
	}

	if ( typeof movie.rate !== 'undefined' ) {
		sets.push(
			"rate = '" + movie.rate + "'"
		);
	}


	if ( typeof movie.genre_ids !== 'undefined' ) {
		sets.push(
			"genre_ids = '" + movie.genre_ids + "'"
		);
	}

	if ( typeof movie.release_date !== 'undefined' ) {
		sets.push(
			"release_date = '" + movie.release_date + "'"
		);
	}

	sets.push(
		"updated_at = datetime('now', 'localtime')"
	);

	query += sets.join( ', ' )
	query += " WHERE id = " + id;

	db.serialize(function() {
		db.run( query, [], next );
	});
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM movies WHERE id = ' + id;

	db.serialize(function() {
		db.run( query, [], next );
	});
};
