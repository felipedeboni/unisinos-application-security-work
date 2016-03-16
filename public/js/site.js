$(function() {

	$( '[data-raty]' ).each(function() {
		var $el = $( this );

		var options = {
			score: function() {
				return $el.attr( 'data-score' );
			}
		};

		var toUpdate = $el.data( 'update' );
		if ( !!toUpdate ) {
			var $toUpdate = $( toUpdate );
			options.click = function( score, e ) {
				$toUpdate.val( score );
			};
		}

		if ( !!$el.data( 'read-only' ) ) {
			options.readOnly = true;
		}

		$el.raty( options );
	});

});
