(function() {
	var distanceUnitService = angular.module('distance-unit-service', []);

	distanceUnitService.service('DistanceUnitService', ['$q', '$http', '$rootScope', function(q, http, rootScope) {

		this.getDistanceUnits = function() {
			var dfd = q.defer();

			http({
				method: 'GET',
				url: rootScope.baseUrl + '/distanceUnit/get',
				dataType: 'JSON',
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {

			});

			return dfd.promise;
		}		
	}]);

})();