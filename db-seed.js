global._escape = require( 'escape-html' );
var config = require( './package.json' );
var sqlite3 = require( 'sqlite3' ).verbose();
var db = new sqlite3.Database( config.dbPath );
var User = require( './models/user' );

var insertGenres = 'INSERT INTO genres (name) ';
insertGenres    += "VALUES ( 'Action' ), ( 'Adventure' ), ( 'Animation' ), ( 'Biography' ), ( 'Comedy' ), ( 'Crime' ), ( 'Documentary' ), ( 'Drama' ), ( 'Family' ), ( 'Fantasy' ), ( 'Film-Nor' ), ( 'History' ), ( 'Horror' ), ( 'Music' ), ( 'Musical' ), ( 'Mistery' ), ( 'Romance' ), ( 'Sci-Fi' ), ( 'Short' ), ( 'Sport' ), ( 'Thriller' ), ( 'War' ), ( 'Western' );"


User.add({
	name: 'Admin',
	email: 'admin@gmail.com',
	phone: '9999',
	is_admin: 1,
	password: 'root'
}, function() {
	db.serialize(function() {

		db.run( insertGenres );

	});
});
