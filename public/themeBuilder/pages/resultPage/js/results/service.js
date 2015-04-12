(function() {
	var resultsService = angular.module('results-service', []);	

	resultsService.service('ResultsCurrencyService', function() {
		var _currency = {
			value: ''
		};

		this.getCurrency = function() {
			return _currency;
		}

		this.getCurrency = function() {
			return _currency;
		}
	});

	resultsService.service('ResultsDistanceUnitService', function() {
		var _distanceUnit = {
			value: '',
			text: ''
		};

		this.getDistanceUnit = function() {
			return _distanceUnit;
		}

		this.setDistanceUnit = function() {
			return _distanceUnit;
		}
	});

	/*resultsService.service('FooterService', ['$q', '$http', function(q, http) {

		this.getFooter = function(guid) {
			var dfd = q.defer();
			
			var adminVroomUrl = 'http://localhost/amazon_svn/vroomAdmin_recode/public';

			http.jsonp(adminVroomUrl + '/theme-builder/partner-content/JSON_CALLBACK/' + guid + '/resultPage/footer', {
				method: 'GET'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});
			
			return dfd.promise;
		}
	}]);*/

	/*resultsService.service('HeaderService', ['$q', '$http', function(q, http) {

		this.getHeader = function(guid) {
			var dfd = q.defer();
			
			var adminVroomUrl = 'http://localhost/amazon_svn/vroomAdmin_recode/public';

			http.jsonp(adminVroomUrl + '/theme-builder/partner-content/JSON_CALLBACK/' + guid + '/resultPage/header', {				
				method: 'GET'				
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});
			
			return dfd.promise;
		}
	}]);*/

	resultsService.service('FavoriteTabsService', function() {
		var _favoriteTabs = [];

		this.getFavoriteTabs = function() {
			return _favoriteTabs;
		}

		this.validateFavorite = function(comparisonTab) {
			var favoriteIndex = -1;
			var totalAttributes = 0;
			var totalPassedAttributes;
			
			for(var i = 0; i < _favoriteTabs.length; i++) {
				totalPassedAttributes = 0;

				if(i == 0) {
					for(var attr in _favoriteTabs[i]) {
						if(attr != '$$hashKey') {
							totalAttributes++;
						}										
					}
				}

				for(var attr in _favoriteTabs[i]) {
					if(JSON.stringify(_favoriteTabs[i][attr]) == JSON.stringify(comparisonTab[attr])) {
						totalPassedAttributes++;
					}
				}

				if(totalPassedAttributes == totalAttributes) {
					favoriteIndex = i;
				}
			}

			return favoriteIndex;
		}

		this.addFavoriteTabs = function(tabs) {

			for(var i = 0; i < tabs.length; i++) {
				_favoriteTabs.push(tabs[i]);	
			}			
		}

		/*this.removeFavoriteTab = function(tab, index) {
			_favoriteTabs.push(tab);
		}*/
	});

	resultsService.service('SearchBarService', function() {

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
				value: false
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

	resultsService.service('MapsService', function() {
		var _map = {
			map: null,
			property: {},
			markers: [],
			userMarker: null
		};

		var _flag = {
			isMapView: false
		};

		var _carMarker = {
			lat: 0,
			lng: 0,
			address: ''
		};

		var _profileImage = {
			map: '',
			main: ''
		};

		this.getMapProfileImage = function() {
			return _profileImage.map;
		}

		this.getMainProfileImage = function() {
			return _profileImage.main;
		}

		this.setMapProfileImage = function(mapImage) {
			_profileImage.map = mapImage
		}

		this.setMainProfileImage = function(mainImage) {
			_profileImage.main = mainImage;
		}

		this.setCarMarker = function(obj) {
			for(var attr in _carMarker) {
				_carMarker[attr] = obj[attr];
			}
		};

		this.getCarMarker = function() {
			return _carMarker;
		};

		this.clearMarkers = function() {
			_map.markers = [];
		};

		this.setMarkers = function(markers) {
			_map.markers = markers;
		};

		this.setMarker = function(marker) {
			_map.markers.push(marker);
		};

		this.setUserMarker = function(marker) {
			_map.userMarker = marker;
		};

		this.getUserMarker = function() {
			return _map.userMarker;
		};

		this.clearUserMarker = function() {
			_map.userMarker = null;
		};


		this.getMarkers = function() {
			return _map.markers;
		}


		this.getFlag = function() {
			return _flag;
		};

		this.setFlag = function(flag) {
			return _flag;
		};


		this.setIsMapViewFlag = function(flag) {
			return _flag.isMapView = flag;
		};

		this.getMapObject = function() {
			return _map;
		};


		this.getMap = function() {
			return _map.map;
		};

		this.setMap = function(map) {
			_map.map = map;
		}

		this.getMapProperty = function() {
			return _map.property;
		};

		this.setMapProperty = function(mapProperty) {
			_map.property = mapProperty;
		}
	});

	resultsService.service('TabsService', ['$rootScope', function(rootScope) {
		var _tabs = [];
		var _selectedIndex = 0;	
		var _selectedIndexBroadCastName = 'updateSelectedIndex';
		
		this.setTab = function(tab, index) {
			_tabs[index] = tab;
		};

		this.getTabs = function() {
			return _tabs;
		};

		this.getTab = function(ind) {
			return _tabs[ind];
		};

		this.getSelectedTab = function() {
			return _tabs[_selectedIndex];
		}

		this.getSelectedIndexBroadCastName = function() {
			return _selectedIndexBroadCastName;
		}

		this.setSelectedIndex = function(selectedIndex) {
			_selectedIndex = selectedIndex;
			rootScope.$broadcast(this.getSelectedIndexBroadCastName());
		};

		this.incrementSelectedIndex = function() {
			_selectedIndex++;
			rootScope.$broadcast(this.getSelectedIndexBroadCastName());
		};

		this.decrementSelectedIndex = function() {
			_selectedIndex--;
			rootScope.$broadcast(this.getSelectedIndexBroadCastName());
		};

		this.getSelectedIndex = function(selectedIndex) {
			return _selectedIndex;
		};
	}]);	

	resultsService.service('ModalsService', function() {
		var _modals = {
			showLoadingVehicle: false,
			showMapModal: false
		};

		this.getModals = function() {
			return _modals;
		};

		this.updateShowMapModal = function(flag) {
			_modals.showMapModal = flag;
		}

		this.updateShowLoadingVehicle = function(flag) {
			_modals.showLoadingVehicle = flag;
		}
	});
})();