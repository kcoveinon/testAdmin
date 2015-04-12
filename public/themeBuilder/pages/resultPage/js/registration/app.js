(function() {
	var vroomApp = angular.module('vroomApp', [
		'globalService',

		'registration-service',
		'registration-controller',
		'registration-directive',

		'country-service',
		'gender-service'
	]);

	vroomApp.config(['$interpolateProvider', '$httpProvider', 'globalDataProvider', function(
		interpolateProvider, 
		httpProvider, 
		globalDataProvider) {
			interpolateProvider.startSymbol(globalDataProvider.getSymbols().start);
			interpolateProvider.endSymbol(globalDataProvider.getSymbols().end);
			httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	}]);	
})()