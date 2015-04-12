(function() {
	var vroomApp = angular.module('vroomApp', [
		'globalService', 
		'country-service', 
		'age-service', 
		'site-service',
		'autocomplete', 
		'location-service', 
		'search-service', 
		'search-controller', 
		'search-directive'
	]);	
	
	vroomApp.config(['$interpolateProvider', '$httpProvider', 'globalDataProvider', function(interpolateProvider, httpProvider, globalDataProvider) {
		interpolateProvider.startSymbol(globalDataProvider.getSymbols().start);
		interpolateProvider.endSymbol(globalDataProvider.getSymbols().end);
		httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);
})();