exports.success = function( req, message ) {
	req.session.success = message;
};

exports.error = function( req, message ) {
	req.session.error = message;
};

exports.info = function( req, message ) {
	req.session.info = message;
};

exports.hasMessage = function( session ) {
	return !!session.error || !!session.success || !!session.info;
};

exports.showMessage = function( session ) {
	if ( !!session.error ) {
		var message = session.error;
		delete session.error;
		return '<div class="alert alert-danger" role="alert">' + message + '</div>'
	} else if ( !!session.success ) {
		var message = session.success;
		delete session.success;
		return '<div class="alert alert-success" role="alert">' + message + '</div>'
	} else if ( !!session.info ) {
		var message = session.info;
		delete session.info;
		return '<div class="alert alert-info" role="alert">' + message + '</div>'
	}
};
