/* Modify the closing and opening tag of angularjs. from {{ }} to  [[ ]] */
vroomApp.config( function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[').endSymbol(']]');
});