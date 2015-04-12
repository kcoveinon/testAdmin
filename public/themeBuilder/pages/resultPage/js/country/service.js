(function() {
	var countryService = angular.module('country-service', []);

	countryService.service('CountryService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		this.getCountries = function() {
			var dfd = q.defer();

			http({
				/*url: '../../country/get',*/
				url: rootScope.baseUrl + '/country/get',
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