(function() {
	var genderService = angular.module('gender-service', []);

	genderService.service('GenderService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		this.getGenders = function() {
			var dfd = q.defer();

			http({
				method: 'GET',
				url: rootScope.baseUrl + '/gender/get',
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {

			});

			return dfd.promise;
		}
	}]);
})();