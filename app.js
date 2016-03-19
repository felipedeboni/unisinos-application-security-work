'use strict';

/**
 * Aqui a gente configura a aplicacao e o servidor,
 * estamos utilizando o express.
 *
 * O "servidor" do node como tu deve ter lido
 * é totalmente capado, não tem nada,
 * bem diferente de um apache ou iis
 * que já resolve tudo pra ti
 */
var config           = require( './package.json' );
var express          = require( 'express' );
var path             = require( 'path' );
var logger           = require( 'morgan' );
var cookieParser     = require( 'cookie-parser' );
var bodyParser       = require( 'body-parser' );
var cookieSession    = require( 'cookie-session' );
var moment           = require( 'moment' );

var auth             = require( './lib/auth' );
var flash            = require( './lib/flash' );

var site             = require( './routes/index' );
var users            = require( './routes/users' );
var search           = require( './routes/search' );
var movies           = require( './routes/movies' );
var comments         = require( './routes/comments' );
var admin            = require( './routes/admin/index' );
var adminUsers       = require( './routes/admin/users' );
var adminMovies      = require( './routes/admin/movies' );
var adminGenres      = require( './routes/admin/genres' );


var app = express();

/**
 * aqui estamos configurando o que vamos usar
 * pra tratar os htmls, tipo o PHP aquele com html junto,
 * precisamos dizer onde é a pasta com os arquivos
 * e dizer o que ele vai usar pra "parsear"
 * (interpretar o código dinamico)
 */
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );

// sessao
app.use(cookieSession({
	name: 'session',
	keys: [ '!#$!#', '()!**)!@' ]
}));

// mostra mensagens de log
app.use( logger( 'dev' ) );

// vai retornar os valores postados em chave / valor
app.use( bodyParser.json() );

// mesma coisa mas pra outro tipo de dado
app.use( bodyParser.urlencoded({ extended: false }) );

// parseia o que ta nos headers da requisicao (uma string grande) e
app.use( cookieParser() );

// aqui a gente diz que o servidor pode servir os arquivos dessa pasta
// estes arquivos sao chamados de estaticos, o apache e iis fazem
// isso automaticamente pra ti
app.use( express.static( path.join( __dirname, 'public' ) ) );

// aqui eh frescura minha pra evitar de escrever a mesma coisa
// varias vezes, crio um objeto pra jogar dados que vao pro html
// e crio um metodo que simplica renderizar a view (escrever menos)
app.use(function( req, res, next ) {
	if ( res !== null ) {
		res.vm = {};
		res.vm.moment = moment;
		res.vm.currentUser = false;

		res.rendr = function( path, callback ) {
			res.vm.flash = flash;
			res.vm.session = req.session;
			res.vm.query = req.query;
			res.render( path, res.vm, callback );
		};
	}
	next();
});

// restringe e ajuda com usuario atual
app.use( auth.setCurrentUser );
app.use( auth.restrictAdmin );

// as urls que a aplicacao/site vai ter
// e o que deve ser feito nessas urls
app.use( '/', site );
app.use( '/', users );
app.use( '/', comments );
app.use( '/search', search );
app.use( '/movies', movies );
app.use( '/admin/', admin );
app.use( '/admin/users', adminUsers );
app.use( '/admin/movies', adminMovies );
app.use( '/admin/genres', adminGenres );

// caso a url nao exista, a gente trata o 404
app.use(function( req, res, next ) {
	//res.rendr( '404' ); // só renderiza a view
});

// aqui o erro eh tratado de fato
// se tiver o status a gente usa,
// senao usaremos o 500 (a coisa ta feia hehehe)
app.use(function( err, req, res, next ) {
	res.status( err.status || 500 );
	res.render( 'error', {
		message: err.message,
		error: err
	});
});

process.on('SIGTERM', function() {
	db.close();
});

module.exports = app;
