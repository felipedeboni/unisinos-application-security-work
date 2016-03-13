var config = require( './package.json' );
var sqlite3 = require( 'sqlite3' ).verbose();
var db = new sqlite3.Database( config.dbPath );

var usersTable = {
	id: 'integer primary key',
	name: 'text',
	email: 'text',
	phone: 'text',
	is_admin: 'integer',
	password: 'text',
	created_at: 'datetime default current_timestamp',
	updated_at: 'datetime default current_timestamp'
};

var moviesTable = {
	id: 'integer primary key',
	name: 'text',
	release_date: 'date',
	rate: 'integer',
	synopsis: 'text',
	genre_ids: 'text',
	created_at: 'datetime default current_timestamp',
	updated_at: 'datetime default current_timestamp'
};

var genresTable = {
	id: 'integer primary key',
	name: 'text',
	created_at: 'datetime default current_timestamp',
	updated_at: 'datetime default current_timestamp'
};

function tableToSQL( tableName, tableDef ) {
	var sql,
		keys,
		fields;

	keys = Object.keys( tableDef );
	fields = [];

	for( var i in keys ) {
		var key = keys[ i ];
		fields.push( key + ' ' + tableDef[ key ] );
	}

	sql = 'CREATE TABLE ' + tableName + ' ( ' + fields.join( ', ' ) + ' )';

	console.log( sql );

	return sql;
};

db.serialize(function() {

	db.run( tableToSQL( 'users', usersTable ) );
	db.run( tableToSQL( 'movies', moviesTable ) );
	db.run( tableToSQL( 'genres', genresTable ) );

});
