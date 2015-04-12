(function() {
	var searchService = angular.module('search-service', []);
	

	searchService.service('SearchBarService', function() {

		var _searchBarParamsDefault = {
			pickupLocation: {
				id: '',
				value: ''
			},
			returnLocation: {
				id: '',
				value: ''
			},
			pickupDate: {
				date: '',
				time: '',
				display: ''
			},
			returnDate: {
				date: '',
				time: '',
				display: ''
			},
			userCountry: {
				value: ''
			},
			driverAge: {
				value: ''
			},
			isSameLocation: {
				value: true
			}
		};

		var _searchBarParams = {};

		for(var attr in _searchBarParamsDefault) {
			_searchBarParams[attr] = _searchBarParamsDefault[attr];
		}
		
		this.resetSearchBarParams = function() {
			for(var attr in _searchBarParamsDefault) {
				_searchBarParams[attr] = _searchBarParamsDefault[attr];
			}
		};

		this.getSearchBarParams = function() {
			return _searchBarParams;
		};
	
	});
	
})();