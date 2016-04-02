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

$(function() {
	if ( window.location.pathname.indexOf( '/movies' ) === -1 ) {
		return false;
	}

	var $commentForm = $( '[data-comment-form="true"]' );
	var $commentFieldset = $commentForm.find( 'fieldset' );
	var $commentField = $commentForm.find( 'textarea' );
	var $commentsContainer = $( '#Comments' );
	var $errorMessage;
	var errorMessageTimer;

	function showGenericErrorMessage( message ) {
		hideGenericErrorMessage();

		if ( !message ) {
			message = 'Something went wrong. Try again.';
		}

		$errorMessage = $( '<div class="alert alert-danger" role="alert">' + message + '</div>' );
		$commentForm.prepend( $errorMessage );

		errorMessageTimer = setTimeout(function() {
			$errorMessage.remove();
		}, 5000);
	};

	function hideGenericErrorMessage() {
		clearTimeout( errorMessageTimer );
		if ( !!$errorMessage ) {
			$errorMessage.remove();
		}
	};

	function renderComment( comment ) {
		var btn = '';

		if ( currentUser.id === comment.user_id ) {
			btn = '<button class="pull-left btn btn-danger btn-xs" data-id="' + comment.id + '">remove</button>';
		}

		var comment = [
			'<div class="panel panel-default comment">',
				'<div class="panel-body">',
					'{{ comment }}',
				'</div>',
				'<div class="panel-footer clearfix">',
					'{{ btnremove }}',
					'<small class="pull-right" style="line-height: 22px;">{{ username }} <span class="text-muted">at {{ created_at }}</span></small>',
				'</div>',
			'</div>'
		]
		.join( '' )
		.replace( '{{ comment }}', comment.comment )
		.replace( '{{ created_at }}', moment(comment.created_at).format( 'DD/MM/YYYY HH:MM:ss' ) )
		.replace( '{{ username }}', comment.user_name )
		.replace( '{{ btnremove }}', btn );

		$commentsContainer.prepend( comment );
	};

	function renderComments( commentsList ) {
		commentsList.forEach(function( comment ) {
			renderComment( comment );
		});
	};

	function removeComment( $btn ) {
		$.ajax({
			url: '/comments/remove',
			type: 'POST',
			data: {
				id: $btn.get(0).dataset.id
			},
			success: function( resp ) {
				if ( !!resp && resp.success ) {
					var $comment = $btn.closest( '.comment' );
					$comment.slideUp(250, function() {
						$comment.remove();
					});
				}
			},
			error: function( xhr ) {
				var message;

				if ( xhr.status == 404 ) {
					message = 'Already been removed.';
				} else if ( xhr.status == 403 ) {
					message = "You can't do this!";
				}

				showGenericErrorMessage( message );
			}
		})
	};

	function submit( e ) {
		e.preventDefault();

		$.ajax({
			url: $commentForm.attr( 'action' ),
			type: $commentForm.attr( 'method' ),
			data: $commentForm.serialize(),
			beforeSend: function() {
				hideGenericErrorMessage();

				if ( $commentField.val().trim().length === 0 ) {
					return false;
				}
				$commentFieldset.attr( 'disabled', 'disabled' );
			},
			success: function( resp ) {
				if ( !resp || !resp.comment ) {
					return this.error();
				}

				onSuccess( resp.comment );
			},
			error: function() {
				showGenericErrorMessage();
			},
			complete: function() {
				$commentFieldset.removeAttr( 'disabled' );
			}
		});

		function onSuccess( resp ) {
			renderComment( resp );
			$commentForm.get(0).reset();
		};
	};

	$commentForm.on( 'submit', submit );

	$commentsContainer.on( 'click', '.btn-danger', function( e ) {
		removeComment( $(this) );
	});

	(function loadComments() {
		$.ajax({
			url: '/movies/' + $commentsContainer.data( 'movie-id' ) + '/comments' ,
			type: 'GET',
			beforeSend: function() {
			},
			success: function( resp ) {
				if ( !!resp ) {
					return renderComments( resp );
				}
				this.error();
			},
			error: function() {
				showGenericErrorMessage();
			},
			complete: function() {
			}
		})
	})();
});
