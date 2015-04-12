(function() {
	var locationService = angular.module('location-service', []);
	
	locationService.service('locationService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
	
		this.getLocations = function(searchTxt) {
			var dfd = q.defer();

	    	/*http.get('location-autocomplete/search/10/' +  searchTxt)
			.success(function(data) {
				dfd.resolve(data);
			});*/

			http({
				method: 'GET',
				url: rootScope.baseUrl + '/location-autocomplete/search/10/' +  searchTxt,
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data)
			}).error(function(data) {

			});

			return dfd.promise;
		};
	   	
	}]);
})();