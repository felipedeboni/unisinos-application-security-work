var db = require( '../db' );

var findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM genres WHERE id = $id", { $id: id }, function( err, row ) {
			next( err, row );
		});
	});
};

exports.findById = findById;

exports.findAll = function( options, next ) {
	options = options || {};
	var query = 'SELECT * FROM genres';

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

exports.add = function( genre, next ) {
	var query = 'INSERT INTO genres (name, created_at, updated_at) ';
	query += "VALUES ($name, datetime('now', 'localtime'), datetime('now', 'localtime'));";

	db.serialize(function() {
		db.run( query, { $name: genre.name }, next );
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

exports.updateById = function( id, genre, next ) {
	var params = {};
	var fields = [];
	var query = 'UPDATE genres SET ';

	params.$id = id;

	fields.push( "name = $name" );
	params.$name = genre.name;

	fields.push( "updated_at = datetime('now', 'localtime')" );

	query += fields.join( ', ' );
	query += " WHERE id = $id;";

	db.serialize(function() {
		db.run( query, params, next );
	});
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM genres WHERE id = $id;';

	db.serialize(function() {
		db.run( query, { $id: id }, next );
	});
};
