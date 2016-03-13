var config = require( './package.json' );
var sqlite3 = require( 'sqlite3' );
var db = new sqlite3.Database( config.dbPath );

module.exports = db;
