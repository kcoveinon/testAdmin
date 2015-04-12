app.directive('loginViaGoogleAction', ['$window', function(win) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				win.location.href = 'loginvia/google-response-url';
			});
		}
	};
}]);

app.directive('loginViaVroomAction', ['$window', function(win) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				win.location.href = 'loginvia/vroom';
			});
		}
	};
}]);

app.directive('forgotPasswordMessageAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {	
			elem.hide();
			scope.$watch('forgotPasswordMessage.show', function(newVal, oldVal) {
				if(newVal != oldVal) {
					if(newVal) {
						elem.fadeIn();
					} else {
						elem.fadeOut();
					}
				}
			})
		}
	};
});

app.directive('forgotPasswordMessageCloseButtonAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {					
				scope.forgotPasswordMessage.show = false;
				scope.$apply();
			});
		}
	};
});

app.directive('forgotPasswordModalAction', ['ForgotPasswordService', function(forgotPasswordService) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.modal({
				closable: false,
				detachable: false,
				onHidden: function() {
					scope.forgotPasswordMessage.show = false;
					scope.$apply();
				},
				onDeny: function() {

					if(!scope.modals.forgotPassword.isTransacting) {
						scope.modals.forgotPassword.show = false;
						scope.forgotEmail = '';
						scope.$apply();
					}
					
					return false;
				},
				onApprove: function() {

					if(!scope.modals.forgotPassword.isTransacting) {
						var forgotEmail = scope.forgotEmail;
												
						var forgotPasswordParams = {
							email: forgotEmail							
						};					

						scope.modals.forgotPassword.isTransacting = true;

						forgotPasswordService.forgotPassword(scope.dashboard, forgotPasswordParams).then(function(data) {
							scope.modals.forgotPassword.isTransacting = false;								
							if(data.result == 'success') {									
								scope.forgotPasswordMessage.message = 'Forgot password link has been sent to your email. Please check your inbox or spam folder.';
								scope.forgotPasswordMessage.messageClass = 'green';									
							} else if(data.result == 'no_data') {
								scope.forgotPasswordMessage.message = 'Email does not exist. Please check your email you have provided.';
								scope.forgotPasswordMessage.messageClass = 'yellow';									
							}
							scope.forgotPasswordMessage.show = true;
						});
					}
					
					scope.$apply();
					return false;
				}
			});

			scope.$watch('modals.forgotPassword.show', function(newVal, oldVal) {
				if(newVal != oldVal) {
					if(newVal) {
						elem.modal('show');
					} else {
						elem.modal('hide');
					}
				}
			});
		}
	};
}]);


app.directive('forgotPasswordButtonAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			
			elem.click(function() {
				scope.modals.forgotPassword.show = true;
				scope.$apply();	
			});
		}
	};
});