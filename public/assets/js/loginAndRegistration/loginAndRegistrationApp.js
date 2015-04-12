var app = angular.module('LoginAndRegistrationApp', [
	'forgot-password-service'
]);

app.config(function($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});