(function() {
	var vroomApp = angular.module('vroomApp', [
		'globalService', 
		
		'country-service', 
		'age-service',
		'customer-service',
		'location-service', 
		'vehicles-service',
		'currency-service',
		'distance-unit-service',
		'localstorage-service',
		
		'autocomplete', 
		
		'results-service', 
		'results-controller',
		'results-filter',
		'results-directive',

		'htmlBuilderModule',

		'google-maps'
	]);
	
	vroomApp.config(['$interpolateProvider', '$httpProvider', 'globalDataProvider', function(interpolateProvider, httpProvider, globalDataProvider) {
		interpolateProvider.startSymbol(globalDataProvider.getSymbols().start);
		interpolateProvider.endSymbol(globalDataProvider.getSymbols().end);
		httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);	
})();