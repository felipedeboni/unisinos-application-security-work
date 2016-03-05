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
var express      = require( 'express' );
var path         = require( 'path' );
var favicon      = require( 'serve-favicon' );
var logger       = require( 'morgan' );
var cookieParser = require( 'cookie-parser' );
var bodyParser   = require( 'body-parser' );

var routes       = require( './routes/index' );
var users        = require( './routes/users' );
var movies       = require( './routes/movies' );
var genres       = require( './routes/genres' );

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
		res.rendr = function( path, callback ) {
			res.render( path, res.vm, callback );
		};
	}
	next();
});

// as urls que a aplicacao/site vai ter
// e o que deve ser feito nessas urls
app.use( '/', routes );
app.use( '/usuarios', users );
app.use( '/filmes', movies );
app.use( '/generos', genres );

// caso a url nao exista, a gente trata o 404
app.use(function( req, res, next ) {
	var err = new Error( 'Not Found' );
	err.status = 404;
	next( err );
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

module.exports = app;
