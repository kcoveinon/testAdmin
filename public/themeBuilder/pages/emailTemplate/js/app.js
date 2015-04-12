vroomApp = angular.module('emailTemplate', []);

vroomApp.config( function($interpolateProvider) {
	$interpolateProvider.startSymbol('<%').endSymbol('%>');
});

vroomApp.directive('jQueryNoteBook', function () {
	return {
		restrict: 'A',
		replace: true,
		link: function (scope, element, attrs) {
			element.notebook();
			console.log('testing');
		
		}
	};
});