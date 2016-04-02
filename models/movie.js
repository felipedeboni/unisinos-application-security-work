var db = require( '../db' );

var findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM movies WHERE id = $id", { $id: id }, function( err, row ) {
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
		db.all( query, options.params || {}, function( err, row ) {
			next( err, row );
		});
	});
};

exports.add = function( movie, next ) {
	var query = 'INSERT INTO movies (name, synopsis, release_date, genre_ids, rate, created_at, updated_at) ';
	query += "VALUES ($name, $synopsis, $release_date, $genre_ids, $rate, datetime('now', 'localtime'), datetime('now', 'localtime'));";

	var params = {
		$name: movie.name,
		$synopsis: movie.synopsis,
		$release_date: movie.release_date,
		$genre_ids: [].concat(movie.genre_ids).join(','),
		$rate: movie.rate
	};

	db.serialize(function() {
		db.run( query, params, next );
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
	var params = {};
	var fields = [];
	var query = 'UPDATE movies SET ';

	params.$id = id;

	if ( typeof movie.name !== 'undefined' ) {
		fields.push( "name = $name" );
		params.$name = movie.name;

	}

	if ( typeof movie.synopsis !== 'undefined' ) {
		fields.push( "synopsis = $synopsis" );
		params.$synopsis = movie.synopsis;

	}

	if ( typeof movie.rate !== 'undefined' ) {
		fields.push( "rate = $rate" );
		params.$rate = movie.rate;

	}


	if ( typeof movie.genre_ids !== 'undefined' ) {
		fields.push( "genre_ids = $genre_ids" );
		params.$genre_ids = [].concat(movie.genre_ids).join(',');

	}

	if ( typeof movie.release_date !== 'undefined' ) {
		fields.push( "release_date = $release_date" );
		params.$release_date = movie.release_date;

	}

	fields.push( "updated_at = datetime('now', 'localtime')" );

	query += fields.join( ', ' );
	query += " WHERE id = $id;";

	db.serialize(function() {
		db.run( query, params, next );
	});
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM movies WHERE id = $id;';

	db.serialize(function() {
		db.run( query, { $id: id }, next );
	});
};
