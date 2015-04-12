(function() {
	var ageService = angular.module('age-service', []);

	ageService.service('AgeService', ['$http', '$q','$rootScope', function(http, q, rootScope) {

		this.getAges = function() {
			var dfd = q.defer();

			http({				
				url: rootScope.baseUrl + '/age/get',
				method: 'GET',
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {
			
			});

			return dfd.promise;
		}
	}]);
})();