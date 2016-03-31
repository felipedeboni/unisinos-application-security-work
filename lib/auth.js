'use strict';

var User = require( '../models/user' );
var bcrypt = require( 'bcrypt' );

var isAuth = exports.isAuth = function( req ) {
	return !!req.session.user_id;
};

var isAdmin = exports.isAdmin = function( req ) {
	return isAuth( req ) && req.currentUser.is_admin;
};

exports.login = function( req, email, password, next ) {
	User.findByEmail( email, function( err, user ) {
		if ( err ) {
			return next( false );
		}


		if ( !!user && bcrypt.compareSync(password, user.password) ) {
			setLogin( req, user.id );
			return next( true );
		}
		return next( false );
	});
};

var setLogin = exports.setLogin = function( req, userId ) {
	req.session.user_id = userId;
};

exports.logout = function( req ) {
	delete req.session.user_id;
	return true;
};

exports.setCurrentUser = function( req, res, next ) {
	if ( isAuth( req ) ) {
		User.findById( req.session.user_id, function( err, user ) {
			if ( !err && !!user ) {
				req.currentUser = user;
				res.vm.currentUser = user;
			}

			return next();
		});
	} else {
		return next();
	}
};

exports.restrictAdmin = function( req, res, next ) {
	if ( !!req.path.match(/^\/admin/) && !isAdmin( req )) {
		return res.redirect( '/404' ).send();
	}
	next();
}
