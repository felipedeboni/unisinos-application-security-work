var db = require( '../db' );

var findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM users WHERE id = '" + id + "'", function( err, row ) {
			next( err, row );
		});
	});
};

exports.findById = findById;

exports.findByEmail = function( email, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM users WHERE email = '" + email + "'", function( err, row ) {
			next( err, row );
		});
	});
};

exports.findAll = function( next ) {
	db.serialize(function() {
		db.all( "SELECT * FROM users", function( err, row ) {
			next( err, row );
		});
	});
};

exports.add = function( user, next ) {
	user.password = 'oi';

	var query = 'INSERT INTO users (name, email, phone, is_admin, password, created_at, updated_at) ';
	query += "VALUES ('" + user.name + "', '" + user.email + "', '" + user.phone + "', " + [].concat(user.is_admin)[ 0 ] + ", '" + user.password + "', datetime('now'), datetime('now'))";

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

exports.updateById = function( id, user, next ) {
	var sets = [];
	var hasUpdate = false;
	var query = 'UPDATE users ';
	query += "SET ";

	if ( typeof user.name !== 'undefined' ) {
		sets.push(
			"name = '" + user.name + "'"
		);
	}

	if ( typeof user.email !== 'undefined' ) {
		sets.push(
			"email = '" + user.email + "'"
		);
	}

	if ( typeof user.phone !== 'undefined' ) {
		sets.push(
			"phone = '" + user.phone + "'"
		);
	}

	if ( typeof user.is_admin !== 'undefined' ) {
		sets.push(
			"is_admin = " + ([].concat(user.is_admin)[ 0 ] == 1 ? 1 : 0)
		);
	}

	if ( typeof user.password !== 'undefined' && user.password.length > 0 ) {
		sets.push(
			"password = '" + user.password + "'"
		);
	}

	sets.push(
		"updated_at = datetime('now')"
	);

	query += sets.join( ', ' )
	query += " WHERE id = " + id;

	db.serialize(function() {
		db.run( query, [], next );
	});
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM users WHERE id = ' + id;

	db.serialize(function() {
		db.run( query, [], next );
	});
};
