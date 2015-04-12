/************
Theme Builder Service.
 ************/

(function() {

    var themeBuilder = angular.module('themeBuilderService', [
    ]);
	
	themeBuilder.service('ajaxCallService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
	
		this.getJson = function(extendedUrl) {
			var dfd = q.defer();

			http({
				method: 'GET',
				url: rootScope.baseUrl + extendedUrl,
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data)
			}).error(function(data) {

			});

			return dfd.promise;
		};
	   	
	}]);
	
	
	
})();