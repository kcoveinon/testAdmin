(function() {
	var vehiclesService = angular.module('vehicles-service', []);

	vehiclesService.service('VehiclesService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		var _vehicles = [];

		this.getServiceVehicles = function() {
			return _vehicles;
		};

		this.setServiceVehicles = function(vehicles) {
			_vehicles = vehicles;
		};

		this.getVehicles = function(obj) {
			var dfd = q.defer();
			obj.debug = true;
			http({
				method: 'POST',
				url: rootScope.baseUrl + '/vehicles/get',
				data: obj,
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {
				alert('Failed to load from the comms layer');
			});

			return dfd.promise;
		}
	}]);
})();