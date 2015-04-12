(function() {
	var forgot_passwordDirective = angular.module('forgot-password-directive', []);	

	forgot_passwordDirective.directive('createNewPasswordButtonAction', ['ForgotPasswordService', '$window', function(forgotPasswordService, win) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					
					if(!scope.isTransacting) {
						var validationResult = forgotPasswordService.validateParams(scope.forgotPasswordParams);
						var isValid = true;

						for(var attr in validationResult) {
							if(validationResult[attr] != '') {
								isValid = false;
							}

							scope.validationResult[attr] = validationResult[attr];
						}

						if(isValid) {
							scope.isTransacting = true;
							forgotPasswordService.createNewPassword(scope.baseUrl, scope.forgotPasswordParams).then(function(data) {
								scope.isTransacting = false;
								if(data.result == 'success') {
									alert('Password successfully changed.');
									win.location.href = scope.baseUrl;
								} else if(data.result == 'no_code') {
									alert('Code has already expired. Please create a new one');
								} else if(data.result == 'invalid_email') {
									alert('Invalid email address');
								} else if(data.result == 'password_not_match') {
									alert('Password does not match');
								}
							});	
						}
						scope.$apply();
					}					
				});
			}
		};
	}]);
})();