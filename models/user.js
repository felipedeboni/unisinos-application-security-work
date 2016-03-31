var db = require( '../db' );
var bcrypt = require( 'bcrypt' );

var findById = function( id, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM users WHERE id = $id;", { $id: id }, function( err, row ) {
			next( err, row );
		});
	});
};

exports.findById = findById;

exports.findByEmail = function( email, next ) {
	db.serialize(function() {
		db.get( "SELECT * FROM users WHERE email = $email;", { $email: email }, function( err, row ) {
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
	var passObject = generatePasswordAndSalt( user.password );

	var query = 'INSERT INTO users (name, email, phone, is_admin, password, salt, created_at, updated_at) ';
	query += "VALUES ($name, $email, $phone, $is_admin, $password, $salt, datetime('now', 'localtime'), datetime('now', 'localtime'));";

	var params = {
		$name: user.name,
		$email: user.email,
		$phone: user.phone,
		$is_admin: [].concat(user.is_admin)[ 0 ],
		$password: passObject.password,
		$salt: passObject.salt
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

exports.updateById = function( id, user, next ) {
	var params = {};
	var fields = [];
	var query = 'UPDATE users SET ';

	params.$id = id;

	if ( typeof user.name !== 'undefined' ) {
		fields.push( "name = $name" );
		params.$name = user.name;
	}

	if ( typeof user.email !== 'undefined' ) {
		fields.push( "email = $email" );
		params.$email = user.email;
	}

	if ( typeof user.phone !== 'undefined' ) {
		fields.push( "phone = $phone" );
		params.$phone = user.phone;
	}

	if ( typeof user.is_admin !== 'undefined' ) {
		fields.push( "is_admin = $is_admin" );
		params.$is_admin = user.is_admin;
	}

	if ( typeof user.password !== 'undefined' && user.password.length > 0 ) {
		var passObject = generatePasswordAndSalt( user.password );

		fields.push( "password = $password" );
		params.$password = passObject.password;


		fields.push( "salt = $salt" );
		params.$salt = passObject.salt;

	}

	fields.push( "updated_at = datetime('now', 'localtime')" );

	query += fields.join( ', ' );
	query += " WHERE id = $id;";

	db.serialize(function() {
		db.run( query, params, next );
	});
};

function generatePasswordAndSalt( rawPassword ) {
	var salt = bcrypt.genSaltSync( 10 );
	var password = bcrypt.hashSync( rawPassword, salt );

	return {
		salt: salt,
		password: password
	};
};

exports.removeById = function( id, next ) {
	var query = 'DELETE FROM users WHERE id = $id;';

	db.serialize(function() {
		db.run( query, { $id: id }, next );
	});
};
