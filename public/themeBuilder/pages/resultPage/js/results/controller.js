(function() {
	var resultsController = angular.module('results-controller', []);

	resultsController.controller('MenuController', [
		'$scope', 
		'CurrencyService', 
		'DistanceUnitService', 
		'ResultsDistanceUnitService', 
		'ResultsCurrencyService', 
		'CustomerService',
		'$rootScope',
		function(scope, currencyService, distanceUnitService, resultsDistanceUnitService, resultsCurrencyService, customerService, rootScope) {
			scope.currencies = [];
			scope.currency = resultsCurrencyService.getCurrency();
			scope.customer = customerService.getCustomer();			
			scope.distanceUnits = [];
			scope.distanceUnit = resultsDistanceUnitService.getDistanceUnit();

			/*
			currencyService.getCurrencies().then(function(data) {
				scope.currencies = data.currencies
			});
			*/
			/*
			distanceUnitService.getDistanceUnits().then(function(data) {
				scope.distanceUnits = data.distanceUnits;				
			});
			*/

			scope.currencies = [{"currencyCode":"AUD","countryCode":"AU"},{"currencyCode":"CAD","countryCode":"CA"},{"currencyCode":"GBP","countryCode":"GB"},{"currencyCode":"USD","countryCode":"US"},{"currencyCode":"HKD","countryCode":"HK"},{"currencyCode":"PHP","countryCode":"PH"},{"currencyCode":"SAR","countryCode":"SA"},{"currencyCode":"ZAR","countryCode":"ZA"},{"currencyCode":"EUR","countryCode":"ES"},{"currencyCode":"SEK","countryCode":"SE"}]

			scope.distanceUnits = [{"unit":"km","name":"kilometer"},{"unit":"mi","name":"miles"}];

			scope.$watch('distanceUnit.value', function(newVal, oldVal) {
				/*if(newVal == 'km') {
					scope.distanceUnit.text = 'KM';
				} else if(newVal == 'mi') {
					scope.distanceUnit.text = 'miles';
				}*/
				angular.forEach(scope.distanceUnits, function(du, ind) {
					if(du.unit == newVal) {
						scope.distanceUnit.text = du.name;
					}
				});
			});
		}
	]);

	/*resultsController.controller('PartnerHeaderController', ['$scope', function(scope) {
		scope.pageHeader = '';
	}]);

	resultsController.controller('PartnerFooterController', ['$scope', function(scope) {
		scope.pageFooter = '';
	}]);*/

	resultsController.controller('ResultsMainController', [
		'$scope',
		'ModalsService',		
		'TabsService',
		'MapsService',
		function(scope, modalsService, tabsService, mapsService) {
			
			scope.tabs = tabsService.getTabs();			
			scope.selectedIndex = tabsService.getSelectedIndex();
			scope.modals = modalsService.getModals();
			scope.map = mapsService.getMapObject();
			scope.mapFlags = mapsService.getFlag();
			scope.depotAddress = '';
			scope.sortList = [
				{
					'id': 'price',
					'label': 'Maximum Price'
				},{
					'id': 'capacity',
					'label': 'Seating Capacity'
				},{
					'id': 'door_count',					
					'label': 'Doors'
				},{
					'id': 'class',
					'label': 'Car Class'
				},{
					'id': 'categoryName',
					'label': 'Vehicle Type'
				},{
					'id': 'supplierName',
					'label': 'Supplier'
				},{
					'id': 'userDistance',
					'label': 'User Distance'
				},
				{
					'id': 'convenience',
					'label': 'Convenience'
				}
			];

			/*scope.sort = {
				column: '',
				reverse: false
			};*/

			mapsService.setMapProperty({
			    center: {
			        latitude: 45,
			        longitude: -73
			    },
			    events: {
			        tilesloaded: function (map) {			           
			            mapsService.setMap(map);
			            scope.$apply();
			        }
			    },
			    zoom: 14
			});
			
			scope.$on(tabsService.getSelectedIndexBroadCastName(), function() {
				scope.selectedIndex = tabsService.getSelectedIndex();
			});
	}]);

	resultsController.controller('SearchController', [
		'$scope',
		'$rootScope',
		'ServerDataService',
		'AgeService',
		'CountryService',
		'VehiclesService',
		'TabsService', 
		'ModalsService',
		'DateTimeService',
		'SearchBarService',
		'MapsService',
		'FavoriteTabsService',
		'LocalStorageService',
		'ResultsDistanceUnitService',
		'ResultsCurrencyService',
		function(scope, rootScope, serverDataService, ageService, countryService, vehiclesService, tabsService, modalsService, dateTimeService, searchBarService, mapsService, favoriteTabsService, localStorageService, resultsDistanceUnitService, resultsCurrencyService) {
			scope.pickupLocations = [];
			scope.returnLocations = [];
			scope.ages = [];
			scope.countries = [];
			
			scope.pickupLocationQuerying = false;
			scope.returnLocationQuerying = false;
			scope.editReturnDate = false;
			scope.editPickupDate = false;
			
			scope.searchBarParams = searchBarService.getSearchBarParams();

			scope.pickupLocation = scope.searchBarParams.pickupLocation;

			scope.returnLocation = scope.searchBarParams.returnLocation;

			scope.pickupDate = scope.searchBarParams.pickupDate;

			scope.returnDate = scope.searchBarParams.returnDate;
			
			scope.userCountry = scope.searchBarParams.userCountry;

			scope.driverAge = scope.searchBarParams.driverAge;

			scope.isSameLocation = scope.searchBarParams.isSameLocation;
					
			scope.server = {
				date: {}
			}

			var favoriteTabs = localStorageService.getItem('favoriteTabs');

			if(favoriteTabs != null) {
				favoriteTabs = JSON.parse(favoriteTabs);
			} else {
				favoriteTabs = [];
			}	

			favoriteTabsService.addFavoriteTabs(favoriteTabs);

			scope.bindGetParams = function(obj) {
				
				var pickupDateDisplay = dateTimeService.formatDateTimeForDisplay(obj.pickupDate, obj.pickupTime);
				var returnDateDisplay = dateTimeService.formatDateTimeForDisplay(obj.returnDate, obj.returnTime);
					
				rootScope.guid = obj.guid;
								
				scope.pickupLocation.id = obj.pickupLocationId;
				scope.pickupLocation.value = obj.pickupLocationName;
					
				scope.returnLocation.id = obj.returnLocationId;
				scope.returnLocation.value = obj.returnLocationName;
				
				scope.pickupDate.date = obj.pickupDate;
				scope.pickupDate.time = obj.pickupTime;
				scope.pickupDate.display = pickupDateDisplay;
				
				scope.returnDate.date = obj.returnDate;
				scope.returnDate.time = obj.returnTime;
				scope.returnDate.display = returnDateDisplay;

				scope.driverAge.value = obj.driverAge;
				scope.userCountry.value = obj.userCountry;

				
				mapsService.setMapProfileImage(obj.mapProfileImage);
				
				if(scope.pickupLocation.id == scope.returnLocation.id) {
					scope.isSameLocation.value = true;
				} else {
					scope.isSameLocation.value = false;
				}
							
				scope.searchVehicles();				
			}

			scope.searchVehicles = function() {

				var selectedIndex = tabsService.getSelectedIndex();
				var pickupDateDisplay = dateTimeService.formatDateTimeForDisplay(scope.pickupDate.date, scope.pickupDate.time);
				var returnDateDisplay = dateTimeService.formatDateTimeForDisplay(scope.returnDate.date, scope.returnDate.time);				
				var currency = resultsCurrencyService.getCurrency();

				var newTab = {
					pickupLocation: {
						id: scope.pickupLocation.id,
						value: scope.pickupLocation.value
					},
					returnLocation: {
						id: scope.returnLocation.id,
						value: scope.returnLocation.value
					},
					pickupDate: {
						date: scope.pickupDate.date,
						time: scope.pickupDate.time,
						display: pickupDateDisplay
					},
					returnDate: {
						date: scope.returnDate.date,
						time: scope.returnDate.time,
						display: returnDateDisplay
					},
					driverAge: {
						value: scope.driverAge.value
					},
					userCountry: {
						value: scope.userCountry.value
					},
					userLocation: {
						location: {
							id: '',
							value: '',
							selected: ''
						},
						coordinates: {
							lat: 0,
							lng: 0
						}
					},
					sort: {
						column: {
							value: 'price'
						},
						reverse: false
					},
					favorited: false,
					userLocations: [],
					userLocationQuerying: false,
					vehicles: [],
					filters: {},
					defaultFilter: {}
				};
				
				var favoriteIndex = favoriteTabsService.validateFavorite(newTab);

				if(favoriteIndex != -1) {
					newTab.favorited = true;
				}

				tabsService.setTab(newTab, selectedIndex);

				modalsService.updateShowLoadingVehicle(true);

				/*
				vehiclesService.getVehicles({
					pickupDate: scope.pickupDate,
					returnDate: scope.returnDate,
					pickupLocation: scope.pickupLocation,
					returnLocation: scope.returnLocation,
					driverAge: scope.driverAge,
					userCountry: scope.userCountry,
					currency: currency.value
				}).then(function(data) {					
					
					var selectedTab;				
					selectedTab = tabsService.getTab(tabsService.getSelectedIndex());
					selectedTab.vehicles = data.vehicles;
					selectedTab.filters = data.filters;
					selectedTab.defaultFilter = data.defaultFilter;
					modalsService.updateShowLoadingVehicle(false);
				});
				*/
				getVehiclesStatic();
				
				function getVehiclesStatic(){
					data = {"vehicles":[{"vehicleElemID":"AU_AV_ECMR","hasAircon":0,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"AV","vehicleName":"Nissan Micra Or Similar","originalPrice":173.58,"price":"173.58","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":5,"storage":4},{"vehicleElemID":"AU_AV_CCMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"AV","vehicleName":"Toyota Yaris Or Similar","originalPrice":184.59,"price":"184.59","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"CCMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":2,"storage":9},{"vehicleElemID":"AU_AV_CCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"AV","vehicleName":"Hyundai i20 Or Similar","originalPrice":190.1,"price":"190.10","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":4,"storage":2},{"vehicleElemID":"AU_AV_ICAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Intermediate","classID":6,"supplierName":"AV","vehicleName":"Hyundai i30 Or Similar","originalPrice":201.12,"price":"201.12","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"ICAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":10},{"vehicleElemID":"AU_AV_SCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Standard","classID":7,"supplierName":"AV","vehicleName":"Holden Cruze Or Similar","originalPrice":206.64,"price":"206.64","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"SCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":7,"storage":6},{"vehicleElemID":"AU_BG_MCMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Mini","classID":1,"supplierName":"BG","vehicleName":"Nissan Micra Or Similar","originalPrice":177.36,"price":"177.36","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"MCMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":10},{"vehicleElemID":"AU_BG_ECMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"BG","vehicleName":"Nissan Micra Or Similar","originalPrice":187.86,"price":"187.86","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":10},{"vehicleElemID":"AU_BG_CCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"BG","vehicleName":"Nissan Micra Auto Or Similar","originalPrice":198.32,"price":"198.32","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":9},{"vehicleElemID":"AU_BG_ICAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Intermediate","classID":6,"supplierName":"BG","vehicleName":"Kia Cerato Or Similar","originalPrice":207.35,"price":"207.35","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"ICAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":2},{"vehicleElemID":"AU_BG_SDAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Standard","classID":7,"supplierName":"BG","vehicleName":"Mitsubishi Lancer Es Or Similar","originalPrice":221.67,"price":"221.67","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"SDAR","distance":"Unlimited","door_count":4,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":2},{"vehicleElemID":"AU_EC_CDAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":219.59,"price":"219.59","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CDAR","distance":"UNLIMITED","door_count":5,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":9,"storage":2},{"vehicleElemID":"AU_EC_ECMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":195.17,"price":"195.17","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"UNLIMITED","door_count":3,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":8,"storage":7},{"vehicleElemID":"AU_EC_CDMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":219.15,"price":"219.15","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"CDMR","distance":"UNLIMITED","door_count":5,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":10,"storage":7}],"filters":{"price":{"identifier":"price","max":"221.67","min":"173.58","value":{"min":"","max":""}},"userDistance":{"identifier":"userDistance","max":0,"min":0,"value":{"min":"","max":""}},"aircon":{"identifier":"hasAircon","choices":[true,false],"value":""},"transmission":{"identifier":"transmission","choices":[{"id":1,"name":"AT"},{"id":2,"name":"MT"},{"id":"","name":"All"}],"value":""},"distance":{"identifier":"distance","choices":[true,false],"value":""},"airport":{"identifier":{"parent":"depot_information","index":"inAirport"},"choices":[true,false],"value":""},"capacity":{"identifier":"capacity","max":10,"min":2,"value":{"min":"","max":""}},"door":{"identifier":"door_count","max":5,"min":3,"value":{"min":"","max":""}},"storage":{"identifier":"storage","max":10,"min":2,"value":{"min":"","max":""}},"class":{"identifier":"classID","choices":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}],"value":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}]},"category":{"identifier":"categoryID","choices":[{"id":1,"name":"Car"}],"value":[{"id":1,"name":"Car"}]},"supplier":{"identifier":"supplierName","choices":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}],"value":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}]},"depot":{"identifier":"depot_information","choices":[{"id":4601,"name":"Arrivals Terminal","supplierName":"AV","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":5260,"name":"Arrivals Terminal","supplierName":"BG","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":10948,"name":"Arrivals Terminal","supplierName":"EC","coordinates":{"lat":-27.404,"lng":153.1097},"userDistance":""}],"value":[{"id":4601,"name":"Arrivals Terminal"},{"id":5260,"name":"Arrivals Terminal"},{"id":10948,"name":"Arrivals Terminal"}]}},"defaultFilter":{"price":{"identifier":"price","max":"221.67","min":"173.58","value":{"min":"","max":""}},"userDistance":{"identifier":"userDistance","max":0,"min":0,"value":{"min":"","max":""}},"aircon":{"identifier":"hasAircon","choices":[true,false],"value":""},"transmission":{"identifier":"transmission","choices":[{"id":1,"name":"AT"},{"id":2,"name":"MT"},{"id":"","name":"All"}],"value":""},"distance":{"identifier":"distance","choices":[true,false],"value":""},"airport":{"identifier":{"parent":"depot_information","index":"inAirport"},"choices":[true,false],"value":""},"capacity":{"identifier":"capacity","max":10,"min":2,"value":{"min":"","max":""}},"door":{"identifier":"door_count","max":5,"min":3,"value":{"min":"","max":""}},"storage":{"identifier":"storage","max":10,"min":2,"value":{"min":"","max":""}},"class":{"identifier":"classID","choices":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}],"value":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}]},"category":{"identifier":"categoryID","choices":[{"id":1,"name":"Car"}],"value":[{"id":1,"name":"Car"}]},"supplier":{"identifier":"supplierName","choices":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}],"value":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}]},"depot":{"identifier":"depot_information","choices":[{"id":4601,"name":"Arrivals Terminal","supplierName":"AV","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":5260,"name":"Arrivals Terminal","supplierName":"BG","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":10948,"name":"Arrivals Terminal","supplierName":"EC","coordinates":{"lat":-27.404,"lng":153.1097},"userDistance":""}],"value":[{"id":4601,"name":"Arrivals Terminal"},{"id":5260,"name":"Arrivals Terminal"},{"id":10948,"name":"Arrivals Terminal"}]}},"general_info":{"pickup_country_name":"Australia","pickup_city":"Brisbane"}};

					var selectedTab;				
					selectedTab = tabsService.getTab(tabsService.getSelectedIndex());
					selectedTab.vehicles = data.vehicles;
					selectedTab.filters = data.filters;
					selectedTab.defaultFilter = data.defaultFilter;
					modalsService.updateShowLoadingVehicle(false);
				}
			}
			/*
			ageService.getAges().then(function(data) {
				scope.ages = data.ages;
			});
			*/

			scope.ages = ["25+"];

			/*
			countryService.getCountries().then(function(data) {
				scope.countries = data.countries;
			});
			*/

			scope.countries = [{"code":"AU","name":"Australia"}];

			/*serverDataService.getServerDate({
				dateFormat: 'F d, Y',
				timeFormat: 'H:i'
			}).then(function(data) {
				
				scope.server.date = data.dates;
				scope.resultParams.pickupDate.date = scope.server.date.date;
				scope.resultParams.pickupDate.time = scope.server.date.time;

				var pickupDateDisplay = dateTimeService.formatDateTimeForDisplay(scope.pickupDate.date, scope.pickupDate.time);
				scope.resultParams.pickupDate.display = pickupDateDisplay;
			});*/

			

			/*serverDataService.getServerDate({
				dateFormat: 'F d, Y',
				timeFormat: 'H:i',
				modify: '+1 day'
			}).then(function(data) {
				scope.server.date = data.dates;
				scope.returnDate.date = scope.server.date.date;
				scope.returnDate.time = scope.server.date.time;
							
				var returnDateDisplay = dateTimeService.formatDateTimeForDisplay(scope.returnDate.date, scope.returnDate.time);
				scope.returnDate.display = returnDateDisplay;
			});*/
	}]);

	resultsController.controller('ResultsController', [
		'$scope',
		'ResultsDistanceUnitService',
		'MapsService',
		'TabsService',
		function(scope, resultsDistanceUnitService, mapsService, tabsService) {
			
			var distanceUnit = resultsDistanceUnitService.getDistanceUnit();
			
			scope.distanceUnit = distanceUnit;
			
			scope.filtersAttrs = {
				price: {
					type: 'double', 
					step: .01, 
					postfix: ' AUD', 
					prettify: false, 
					hasGrid: true				
				},
				userDistance: {
					type : 'double',
					step : .1, 
					disable: true, 
					postfix : ' ' + distanceUnit.text,
					prettify : false, 
					hasGrid : true
				},
				seatCapacity: {
					type: 'double', 
					postfix: ' seats', 
					step: 1, 
					prettify: false, 
					hasGrid : true
				},
				doorCount: {
					type : 'double', 
					postfix : ' door',
					step : 1, 
					prettify : false, 
					hasGrid : true
				},
				storage: {
					type : 'double', 
					postfix : ' storage', 
					step : 1, 
					prettify : false, 
					hasGrid : true
				}
			};			
		}
	]);

	resultsController.controller('FavoritesController', [
		'$scope', 
		'LocalStorageService',
		'FavoriteTabsService',
		function(scope, localStorageService, favoriteTabsService) {
			
			scope.favoriteTabs = favoriteTabsService.getFavoriteTabs();
	}]);	

	resultsController.controller('TabController', ['$scope', 'TabsService', function(scope, tabsService) {

		scope.$watch('tab.filters', function(newVal, oldVal) {

			/*
				filter vehicles
			*/
			if(newVal != oldVal) {
				var filter = newVal;
				var toShow;
				var classFlag;
				var categoryFlag;
				var supplierFlag;
				/*var selectedTab = tabsService.getSelectedTab();*/

				angular.forEach(scope.tab.vehicles, function(obj, ind) {

					toShow = true;


					if(filter.price.value.min != '' && filter.price.value.max != '') {
						if(parseFloat(obj.price) < parseFloat(filter.price.value.min) || parseFloat(obj.price) > parseFloat(filter.price.value.max)) {
							toShow = false;
						}

						/*if(parseFloat(obj.price) > parseFloat(filter.price.value)) {
							toShow = false;
						}*/
					}

					if(filter.userDistance.value.min != '' && filter.userDistance.value.max != '') {
						/*if(parseFloat(obj.userDistance) > parseFloat(filter.userDistance.value)) {
							toShow = false;
						}*/

						if(parseFloat(obj.userDistance) < parseFloat(filter.userDistance.value.min) || parseFloat(obj.userDistance) > parseFloat(filter.userDistance.value.max)) {
							toShow = false;		
						}
					}

					if(filter.aircon.value != '') {
						if(obj.hasAircon != filter.aircon.value) {
							toShow = false;
						}
					}

					if(filter.transmission.value != '') {
						if(obj.transmission.id != filter.transmission.value) {
							toShow = false;
						}
					}


					if(filter.distance.value != '') {
						if(obj.distance != filter.distance.value) {
							toShow = false;
						}
					}

					if(filter.airport.value != '') {
						if(obj.depot_information.inAirport != filter.airport.value) {
							toShow = false;
						}
					}

					if(filter.capacity.value.min != '' && filter.capacity.value.max != '') {
						/*if(parseFloat(obj.capacity) > parseFloat(filter.capacity.value)) {
							toShow = false;
						}*/

						if(parseFloat(obj.capacity) < parseFloat(filter.capacity.value.min) || parseFloat(obj.capacity) > parseFloat(filter.capacity.value.max)) {
							toShow = false;		
						}
					}

					if(filter.door.value.min != '' && filter.door.value.max != '') {
						/*if(parseFloat(obj.door_count) > parseFloat(filter.door.value)) {
							toShow = false;
						}*/

						if(parseFloat(obj.door_count) < parseFloat(filter.door.value.min) || parseFloat(obj.door_count) > parseFloat(filter.door.value.max)) {
							toShow = false;		
						}
					}

					if(filter.storage.value.min != '' && filter.storage.value.max != '') {
						/*if(parseFloat(obj.storage) > parseFloat(filter.storage.value)) {
							toShow = false;
						}*/

						if(parseFloat(obj.storage) < parseFloat(filter.storage.value.min) || parseFloat(obj.storage) > parseFloat(filter.storage.value.max)) {
							toShow = false;		
						}
					}

					classFlag = false;
					angular.forEach(filter.class.value, function(classObj, ind) {
						if(obj.classID == classObj.id) {
							classFlag = true;
						}
					});

					if(!classFlag) {
						toShow = false;
					}

					categoryFlag = false;

					angular.forEach(filter.category.value, function(categoryObj, ind) {
						if(obj.categoryID == categoryObj.id) {
							categoryFlag = true;
						}
					});

					if(!categoryFlag) {
						toShow = false;
					}

					supplierFlag = false;
					
					angular.forEach(filter.supplier.value, function(supplierObj, ind) {
						if(obj.supplierName == supplierObj.id) {
							supplierFlag = true;
						}
					});

					if(!supplierFlag) {
						toShow = false;
					}

					depotFlag = false;
					
					angular.forEach(filter.depot.value, function(depotObj, ind) {
						if(obj.depot_information.depotId == depotObj.id) {
							depotFlag = true;
						}
					});

					if(!depotFlag) {
						toShow = false;
					}

					if(!toShow) {
						/*scope.tabs[scope.selectedIndex].vehicles[ind].is_shown = false;*/
						scope.tab.vehicles[ind].is_shown = false;
					} else {
						/*scope.tabs[scope.selectedIndex].vehicles[ind].is_shown = true;*/
						scope.tab.vehicles[ind].is_shown = true;
					}
				});
			}
		}, true);
	}]);
})();