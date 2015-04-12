(function() {
	var resultsFilter = angular.module('results-filter', []);

	resultsFilter.filter('priceFormatter', function() {
		return function(price) {
			return price.toFixed(2);
		};
	})
})();