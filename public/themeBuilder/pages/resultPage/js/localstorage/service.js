(function() {
	var localStorageService = angular.module('localstorage-service', []);

	localStorageService.service('LocalStorageService', function() {
		var _locStorage = window.localStorage;

		this.setItem = function(ind, val) {
			_locStorage.setItem(ind, val);
		}

		this.getItem = function(ind) {
			var item = _locStorage.getItem(ind);
			
			return item;
		}

		this.removeItem = function(ind) {
			_locStorage.removeItem(ind);
		}
	});
})()