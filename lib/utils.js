exports.validateUser = function( data, includePassword, includeConfirmation ) {
	var message = 'All fields are required.';
	var isValid = (
		data.name.trim().length > 0
		&&
		data.email.trim().length > 0
		&&
		data.phone.trim().length > 0
	);

	if ( isValid ) {
		if ( includePassword ) {
			isValid = data.password.trim().length > 0;
		}

		if ( isValid && includeConfirmation ) {
			isValid = data.password === data.password_confirm;
			message = 'Password does not match';
		}
	}

	return {
		isValid: isValid,
		message: message
	};
};

exports.nl2brEscape = function( str ) {
	return _escape(str).replace( /\r\n/g, '<br/>' );
}
