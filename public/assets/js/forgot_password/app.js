var app = angular.module('ForgotPasswordApp', [
	'forgot-password-service',
	'forgot-password-directive',
	'forgot-password-controller'
]);

app.config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});