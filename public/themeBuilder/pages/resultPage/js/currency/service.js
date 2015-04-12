(function() {
	var currencyService = angular.module('currency-service', []);

	currencyService.service('CurrencyService', ['$q', '$http', '$rootScope', function(q, http, rootScope) {
		
		this.getCurrencies = function() {
			var dfd = q.defer();

			http({
				url: rootScope.baseUrl + '/currency/get',
				method: 'GET',
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		};

		this.getConversionRate = function(toCurrency) {
			var dfd = q.defer();

			http({
				url: rootScope.baseUrl + '/currency/get-conversion-rate',
				method: 'POST',
				data: {
					toCurrency: toCurrency
				},
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		}
	}]);
})();