vroomApp = angular.module('vroomCustomer', []);

vroomApp.config( function($interpolateProvider) {
	$interpolateProvider.startSymbol('<%').endSymbol('%>');
});