(function() {
	var registrationService = angular.module('registration-service', []);

	registrationService.service('RegistrationService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		this.registerCustomer = function(obj) {
			var dfd = q.defer();

			http({
				method: 'POST',
				dataType: 'JSON',
				data: obj,
				url: rootScope.baseUrl + '/registration'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		}
	}]);
})();