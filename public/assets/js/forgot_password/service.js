(function() {
	var forgot_passwordService = angular.module('forgot-password-service', []);	

	forgot_passwordService.service('ForgotPasswordService', ['$q', '$http', function(q, http) {
		var _params = {
			forgotPasswordCode: '',
			email: '',
			password: '',
			retype: ''
		};

		this.getParams = function() {
			return _params;
		};

		this.validateParams = function(forgotPasswordParams) {
			var _results = {};

			for(var attr in _params) {
				_results[attr] = '';
			}

			var email = forgotPasswordParams.email;
			var password = forgotPasswordParams.password;
			var retypePassword = forgotPasswordParams.retype;

			if(email == '') {
				_results.email = 'Email is required';				
			} else if(!/\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/g.test(email)) {
				_results.email = 'Invalid format of email address';
			}

			if(password == '') {
				_results.password = 'Password is required';
			} else if(!/[a-z0-9]{6,}/ig.test(password)) {
				_results.password = 'Password should be alphanumeric and not less than 6.';
			} else {
				if(password != retypePassword) {
					_results.password = 'Password does not match';
				}
			}		

			return _results;
		}

		this.forgotPassword = function(baseUrl, forgotPasswordParams) {
			var dfd = q.defer();

			http({
				url: baseUrl + '/forgot-password/process',
				method: 'POST',
				dataType: 'json',
				data: {
					email: forgotPasswordParams.email,
					alias: forgotPasswordParams.alias
				}
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		};

		this.createNewPassword = function(baseUrl, params) {
			var dfd = q.defer();

			http({
				url: baseUrl + '/forgot-password/create-new-password',
				method: 'POST',
				dataType: 'JSON',
				data: {
					forgotPasswordCode: params.forgotPasswordCode,
					email: params.email,
					password: params.password,
					retype: params.retype
				}
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		};
	}]);
})();