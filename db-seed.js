var config = require( './package.json' );
var sqlite3 = require( 'sqlite3' ).verbose();
var db = new sqlite3.Database( config.dbPath );

var insertGenres = 'INSERT INTO genres (name) ';
insertGenres    += "VALUES ( 'Action' ), ( 'Adventure' ), ( 'Animation' ), ( 'Biography' ), ( 'Comedy' ), ( 'Crime' ), ( 'Documentary' ), ( 'Drama' ), ( 'Family' ), ( 'Fantasy' ), ( 'Film-Nor' ), ( 'History' ), ( 'Horror' ), ( 'Music' ), ( 'Musical' ), ( 'Mistery' ), ( 'Romance' ), ( 'Sci-Fi' ), ( 'Short' ), ( 'Sport' ), ( 'Thriller' ), ( 'War' ), ( 'Western' );"

var insertUsers  = 'INSERT INTO users (name, email, phone, is_admin, password) ';
    insertUsers += "VALUES ('Admin', 'admin@gmail.com', '9999', 1, 'root')";

db.serialize(function() {

	db.run( insertUsers );
	db.run( insertGenres );

});
