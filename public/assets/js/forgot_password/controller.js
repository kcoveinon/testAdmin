(function() {
	var forgot_passwordController = angular.module('forgot-password-controller', []);

	forgot_passwordController.controller('ForgotPasswordController', ['$scope', 'ForgotPasswordService', function(scope, forgotPasswordService) {
		scope.forgotPasswordParams = forgotPasswordService.getParams();
		scope.isTransacting = false;
		scope.validationResult = {};
		scope.baseUrl = '';
		for(var attr in scope.forgotPasswordParams) {
			scope.validationResult[attr] = '';
		}
	}]);
})();