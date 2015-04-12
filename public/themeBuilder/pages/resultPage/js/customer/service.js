(function() {
	var customerService = angular.module('customer-service', []);

	customerService.service('CustomerService', ['$q', '$http', '$rootScope', function(q, http, rootScope) {
		var _customer = {
			email: ''
		};

		this.setEmail = function(email) {
			_customer.email = email;
		}

		this.getEmail = function() {
			return _customer.email;
		}

		this.getCustomer = function() {
			return _customer;
		}

		this.updateDistanceUnit = function(distanceUnit) {
			var dfd = q.defer();

			http({
				url: rootScope.baseUrl + '/customer/update-distance-unit',
				method: 'POST',
				dataType: 'JSON',
				data: {
					distanceUnit: distanceUnit
				}
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {

			});

			return dfd;
		}

		this.updateCurrency = function(currency) {
			var dfd = q.defer();

			http({
				url: rootScope.baseUrl + '/customer/update-currency',
				method: 'POST',
				dataType: 'JSON',
				data: {
					currency: currency
				}
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {

			});

			return dfd;
		}
	}]);
})();