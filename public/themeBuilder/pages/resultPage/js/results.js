vroomApp.factory('splaces', function() {
	return [];
});


vroomApp.factory('helpers', function() {
	return  {
		disect_time: function(arr_time) {
			var hour = parseInt(arr_time.hour);
			var minute = parseInt(arr_time.minute);
			var suff;	
			var time_disect_array;

			if(hour == 0) {
				hour = 12;
				suff = 'AM';
			} else if(hour < 12) {
				suff = 'AM';
			} else {
				suff = 'PM';
				hour -= 12;
			}

			if(hour < 10) {
				hour = "0" + hour;
			}

			if(minute < 10) {
				minute = "0" + minute;
			}

			time_disect_array = {
				hour: hour,
				minute: minute,
				suffix: suff
			};

			return time_disect_array;
		},
		split_time_with_timezone: function(objTime) {
			var arr_time = objTime.toTimeString().split(' ');

			return arr_time[0];
		},
		split_date_to_object: function(dateText) {
			var arr_date = dateText.split('-');
			var obj_date;

			obj_date = {
				year: arr_date[0],		
				day: arr_date[2],
				month: arr_date[1]
			};

			return obj_date;
		},
		extract_time_from_isostring: function(objDate) {
			var arr_date = objDate.split('T');
			return arr_date[0];
		},		
		split_time_to_object: function(timeText) {
			var arr_time = timeText.split(':');

			var obj_time;

			obj_time = {
				hour: arr_time[0],		
				minute: arr_time[1],
				second: arr_time[2]
			};

			return obj_time;
		}
	};
});

vroomApp.controller('ResultsController', function ResultsController($scope, $http, splaces, $compile, helpers) {	
	var page_dimmer = '.page.dimmer';
	var book_dimmer = '.book.dimmer';
	var vehicles = [];
	var rr_filters;
	var main_arr;
	var car_favorites;
	var search_favorites;
	var suppliers;
	var has_search_changes;
	var tmp_return_date;
	
	main_arr = new Array;
	arr_filters = new Object;

	car_favorites = JSON.parse(window.localStorage.getItem('car_favorites'));
	search_favorites = JSON.parse(window.localStorage.getItem('search_favorites'));


	if(car_favorites == null) {
		car_favorites = [];
	} 

	if(search_favorites == null) {
		search_favorites = [];
	} 
	has_search_changes = false;
	angular.forEach(search_favorites, function(row, index) {
		tmp_return_date = new Date(row.return_date);
		if(tmp_return_date < current_date) {
			search_favorites.splice(index, 1);
			has_search_changes = true;
		}
	});

	if(has_search_changes) {
		window.localStorage.setItem('search_favorites', JSON.stringify(search_favorites));
	}

	$scope.mapInstance = null;
 
 	$scope.marker = null;
 	$scope.markers = [];
 	
 	$scope.Math = window.Math; 	
	$scope.map = {
	    center: {
	        latitude: 45,
	        longitude: -73
	    },
	    events: {
	        tilesloaded: function (map) {
	            $scope.$apply(function () {
	               $scope.mapInstance = map;
	            });	            
	        }
	    },
	    zoom: 15
	};
	
	$scope.date_header_text = '';
	$scope.time_header_text = '';
		
	/*$scope.rr_filters = rr_filters;*/
	$scope.sort = {
		column: '',
		reverse: false
	};

	$scope.sort_list = [
		{
			'id': 'price',
			'label': 'Price'
		},{
			'id': 'capacity',
			'label': 'Capacity'
		},{
			/*'id': 'door_count',*/
			'id': 'capacity',
			'label': 'Door Count'
		},{
			'id': 'class',
			'label': 'Class Type'
		},{
			'id': 'categoryName',
			'label': 'Category'
		},{
			'id': 'supplierName',
			'label': 'Supplier'
		},{
			'id': 'user_distance',
			'label': 'Distance'
		}
	];
	
	suppliers = [
		'AD',	
		'AL',
		'AV',
		'BG',
		'DO',
		'EC',
		'EN',
		'EZ',
		'FX',
		'GM',
		'HZ',
		'NA',
		'PL',
		'RS',
		'SX',
		'TH'
	];

	$scope.page_dimmer = page_dimmer;
	$scope.book_dimmer = book_dimmer;
	$scope.main_arr = main_arr;
	$scope.car_favorites = car_favorites;
	$scope.search_favorites = search_favorites;
	$scope.suppliers = suppliers;
	$scope.placesAutocompleteTimeout = null;
	$scope.addressAutocompleteTimeout = null;
	$scope.price = 200;	
	$scope.places = [];
	$scope.addresses = [];
	$scope.moved = '';
	$scope.autocomplete_index = 0;
		
	/*$('.ui.modal.map').modal({
		closable: false
	});*/
	
	$scope.current_selected_search = "";


	$scope.setUserLocation = function() {
		var user_lat = $scope.main_arr[$scope.current_selected_search].lat;
		var user_lon = $scope.main_arr[$scope.current_selected_search].lon;

		if($scope.marker != null) {
			$scope.marker.setMap(null);
		}

		if(user_lat && user_lon) {
			var addressLatLng = new google.maps.LatLng(user_lat, user_lon);
			var marker = new google.maps.Marker({
			    position: addressLatLng,
			    map: $scope.mapInstance,
			    icon: "http://maps.google.com/mapfiles/ms/icons/green.png",
			    title: "Hello World!"
			});

			var infowindow = new google.maps.InfoWindow();
			infowindow.setContent('Your Location');			

			google.maps.event.addListener(marker, 'click', function() {				
		    	infowindow.open($scope.mapInstance, marker);
		  	});

			/*$scope.markers.push({
				marker: marker,
				infowindow: infowindow
			});*/
			$scope.marker = marker;
		} else {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {					
					var addressLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					var marker = new google.maps.Marker({
					    position: addressLatLng,
					    map: $scope.mapInstance,
					    icon: "http://maps.google.com/mapfiles/ms/icons/green.png",
					    title: "Hello World!"
					});

					var infowindow = new google.maps.InfoWindow();
					infowindow.setContent('Your Location');			
					
					google.maps.event.addListener(marker, 'click', function() {				
				    	infowindow.open($scope.mapInstance, marker);
				  	});

					/*$scope.markers.push({
						marker: marker,
						infowindow: infowindow
					});*/
					$scope.marker = marker;

				}, function() {
					$scope.handleNoGeolocation(true);
				});
			} else {
				// Browser doesn't support Geolocation
				$scope.handleNoGeolocation(false);
			}
		}
	};

	$scope.handleNoGeolocation = function(errorFlag) {
		/*if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: $scope.mapInstance,
			position: new google.maps.LatLng(60, 105),
			content: content
		};

		var infowindow = new google.maps.InfoWindow(options);
		$scope.mapInstance.setCenter(options.position);*/

		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		alert(content);
	};

	$scope.update_search_form = function() {				
		var pDateTime = new Date($scope.pickupDateScope + ' ' + $scope.pickupTimeScope);
		var rDateTime = new Date($scope.returnDateScope + ' ' + $scope.returnTimeScope);
		
		var obj_pickup_date = helpers.split_date_to_object($scope.pickupDateScope);
		var obj_return_date = helpers.split_date_to_object($scope.returnDateScope);
		var obj_pickup_time = helpers.split_time_to_object($scope.pickupTimeScope);
		var obj_return_time = helpers.split_time_to_object($scope.returnTimeScope);

		d_pickup_time = helpers.disect_time(obj_pickup_time);
		d_return_time = helpers.disect_time(obj_return_time);		

		$scope.pickupDateModel = month[parseInt(obj_pickup_date.month) - 1] + ' ' + obj_pickup_date.day + ' ' + d_pickup_time.hour + ':' + d_pickup_time.minute + ' ' + d_pickup_time.suffix;
		$scope.returnDateModel = month[parseInt(obj_return_date.month) - 1] + ' ' + obj_return_date.day + ' ' + d_return_time.hour + ':' + d_return_time.minute + ' ' + d_return_time.suffix;		
	};

	$scope.countryNameScope = '';

	if(is_get) {
		$scope.pickupScope = pickup_location;
		$scope.pickupIdScope = pickup_location_id;
		$scope.returnIdScope = return_location_id;
		$scope.ageScope = age;
		$scope.countryScope = citizen_country;
		$scope.pickupDateScope = pickup_date;
		$scope.returnDateScope = return_date;
		$scope.pickupTimeScope = pickup_time;
		$scope.returnTimeScope = return_time;
		$scope.update_search_form();
	} else {
		$scope.pickupScope = '';
		$scope.pickupIdScope = '';
		$scope.returnIdScope = '';
		$scope.ageScope = '';
		$scope.countryScope = '';
		$scope.pickupDateScope = '';
		$scope.returnDateScope = '';
		$scope.pickupTimeScope = '';
		$scope.returnTimeScope = '';	
	}

	$scope.map_user_lat = '';
	$scope.map_user_lon = '';
	$scope.map_user_address = '';

	$scope.get_results = function() {
		var arr_params;			
		arr_params = new Object;

		/*$scope.ageScope = $('.age.dropdown').dropdown('get value');
		$scope.countryScope = $('.country.dropdown').dropdown('get value');*/
		arr_params['pickup_place'] = $scope.pickupIdScope;
		arr_params['return_place'] = $scope.returnIdScope;
		arr_params['pickup_datetime'] = $scope.pickupDateScope + 'T' + $scope.pickupTimeScope;
		arr_params['return_datetime'] = $scope.returnDateScope + 'T' + $scope.returnTimeScope;
		arr_params['citizen_country'] = $scope.countryScope;
		arr_params['age'] = $scope.ageScope; 
		arr_params['debug'] = false;
		/*			
		$http.post('getVehicles', arr_params)
		.success(function(data, status, headers, config)  {
			var min_price;
			var max_price;

			var min_capacity;
			var max_capacity;

			var min_door_count;
			var max_door_count;

			var min_storage;
			var max_storage;

			min_price = 0;
			max_price = 0;
			min_capacity = 0;
			max_capacity = 0;
			min_door_count = 0;
			max_door_count = 0;
			min_storage = 0;
			max_storage = 0;
			min_user_distance = 0;
			max_user_distance = 0;

			var shown_suppliers = [];
			var shown_classes = [];
			var shown_categories = [];

			var rr_filters = {
				transmission: {
					choices: {
						automatic: 1,
						manual: 2,
						not_specified: ''
					},
					value: ''
				},
				aircon: {
					choices: {
						has_aircon: 1,
						has_no_aircon: 0
					},
					value: ''
				},
				airport: {
					choices: {
						in_airport: 1,
						not_in_airport: 0
					},
					value: ''	
				},
				
				class:  {
					choices: [],					
					value: []
				},	
				category: {
					choices: [],
					value: []
				},
				price: {
					choices: {
						min_value: min_price,
						max_value: max_price
					},
					value: ''
				},
				user_distance: {
					choices: {
						min_value: min_user_distance,
						max_value: max_user_distance
					},
					value: ''
				},
				capacity: {
					choices: {
						min_value: min_capacity,
						max_value: max_capacity
					},
					value: ''
				},
				door_count: {
					choices: {
						min_value: min_door_count,
						max_value: max_door_count
					},
					value: ''
				},
				storage: {
					choices: {
						min_value: min_storage,
						max_value: max_storage
					},
					value: ''
				},
				supplier: {
					choices: [],
					value: []
				}
			};

			var found_class;
			var found_category;

			angular.forEach(data.vehicles, function(row, index) {
				
				
				if(min_storage == 0) {
					min_storage = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(row['capacity']) < parseFloat(min_storage)) {
						min_storage = data.vehicles[index]['capacity'];
					}
				}

				if(max_storage == 0) {
					max_storage = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_storage)) {
						max_storage = data.vehicles[index]['capacity'];
					}
				}

				
				if(min_door_count == 0) {
					min_door_count = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(row['capacity']) < parseFloat(min_door_count)) {
						min_door_count = data.vehicles[index]['capacity'];
					}
				}

				if(max_door_count == 0) {
					max_door_count = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_door_count)) {
						max_door_count = data.vehicles[index]['capacity'];
					}
				}

				
				if(min_capacity == 0) {
					min_capacity = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(row['capacity']) < parseFloat(min_capacity)) {
						min_capacity = data.vehicles[index]['capacity'];
					}	
				}

				if(max_capacity == 0) {
					max_capacity = data.vehicles[index]['capacity'];
				} else {
					if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_capacity)) {
						max_capacity = data.vehicles[index]['capacity'];
					}
				}

				
				if(min_price == 0) {
					min_price = data.vehicles[index]['price'];
				} else {
					if(parseFloat(row['price']) < parseFloat(min_price)) {
						min_price = data.vehicles[index]['price'];
					}	
				}

				if(max_price == 0) {
					max_price = data.vehicles[index]['price'];
				} else {
					if(parseFloat(data.vehicles[index]['price']) > parseFloat(max_price)) {
						max_price = data.vehicles[index]['price'];
					}
				}

				data.vehicles[index]['is_shown'] = true;
				data.vehicles[index]['is_favorite'] = false;
				data.vehicles[index]['special'] = '';
				data.vehicles[index]['extra'] = '';
				data.vehicles[index]['user_distance'] = 0;

				if(data.vehicles[index]['vehicleName'].match(/mystery/gi)) {
					data.vehicles[index]['special'] = 'mystery';
				}
				
				if(shown_suppliers.indexOf(data.vehicles[index]['supplierName']) == -1) {
					shown_suppliers.push(data.vehicles[index]['supplierName']);
				}

				found_class = shown_classes.some(function(obj) {
					return obj.id == data.vehicles[index]['classID']
				});

				found_category = shown_categories.some(function(obj) {
					return obj.id == data.vehicles[index]['categoryID']
				});

				if(!found_class) {
					shown_classes.push({
						id: data.vehicles[index]['classID'],
						name: data.vehicles[index]['class']
					});
				}

				if(!found_category) {
					shown_categories.push({
						id: data.vehicles[index]['categoryID'],
						name: data.vehicles[index]['categoryName']
					});
				}

				if(data.vehicles[index]['price'] > 60 && data.vehicles[index]['price'] < 70) {
					data.vehicles[index]['extra'] = 'featured';
				} else if(data.vehicles[index]['price'] > 70 && data.vehicles[index]['price'] < 80) {
					data.vehicles[index]['extra'] = 'discounted';
				} else if(data.vehicles[index]['price'] > 80 && data.vehicles[index]['price'] < 90) {
					data.vehicles[index]['extra'] = 'best';
				} else if(data.vehicles[index]['price'] > 90 && data.vehicles[index]['price'] < 100) {
					data.vehicles[index]['extra'] = 'popular';
				}

				angular.forEach(car_favorites, function(fav_row, fav_index) {
					if(fav_row.id == row.vehicleElemID) {
						data.vehicles[index]['is_favorite'] = true;
					} 
				})						
			});
			
					
			rr_filters.supplier.choices = shown_suppliers;
			rr_filters.class.choices = shown_classes;
			rr_filters.category.choices = shown_categories;

					
			var research_elem;
			var mainarr_length;	
			
			mainarr_length = $scope.main_arr.length;
			$scope.main_arr[mainarr_length] = {};
			$scope.main_arr[mainarr_length]['lat'] = '';
			$scope.main_arr[mainarr_length]['lon'] = '';
			$scope.main_arr[mainarr_length]['address'] = '';
			$scope.main_arr[mainarr_length]['arr_filters'] = rr_filters;
			$scope.main_arr[mainarr_length]['vehicles'] = data.vehicles;
			$scope.main_arr[mainarr_length]['class'] = 's-' + mainarr_length;
			$scope.main_arr[mainarr_length]['shown_suppliers'] = shown_suppliers;
			$scope.main_arr[mainarr_length]['min_price'] = min_price;
			$scope.main_arr[mainarr_length]['max_price'] = max_price;

			$scope.main_arr[mainarr_length]['min_capacity'] = min_capacity;
			$scope.main_arr[mainarr_length]['max_capacity'] = max_capacity;

			$scope.main_arr[mainarr_length]['min_door_count'] = min_door_count;
			$scope.main_arr[mainarr_length]['max_door_count'] = max_door_count;

			$scope.main_arr[mainarr_length]['min_storage'] = min_storage;
			$scope.main_arr[mainarr_length]['max_storage'] = max_storage;

			$scope.main_arr[mainarr_length]['min_user_distance'] = 0;
			$scope.main_arr[mainarr_length]['max_user_distance'] = 0;

			$scope.main_arr[mainarr_length]['user_distance_filter'] = true;

			
			var tab_id = $scope.pickupIdScope + '_' + $scope.returnIdScope + '_' + $scope.pickupDateScope + '_' + $scope.pickupTimeScope + '_' + $scope.returnDateScope + '_' + $scope.returnTimeScope + '_' + $scope.ageScope + '_' + $scope.countryScope;
						
			research_elem = $("<a tab-item-action />");
			research_elem.attr('id', 'search-' + tab_id);
			research_elem.addClass('active item');
			research_elem.attr('search_id', mainarr_length);
			

			research_elem.attr('datetime_text', $scope.pickupDateModel + " to " + $scope.returnDateModel);
			research_elem.attr('pickup_date', $scope.pickupDateScope);
			research_elem.attr('pickup_time', $scope.pickupTimeScope);

			research_elem.attr('return_date', $scope.returnDateScope);
			research_elem.attr('return_time', $scope.returnTimeScope);

			research_elem.attr('pickup_place_name', $scope.pickupScope);

			research_elem.attr('pickup_place', $scope.pickupIdScope);
			research_elem.attr('return_place', $scope.returnIdScope);

			research_elem.attr('age', $scope.ageScope);
			
			research_elem.attr('citizen_country', $scope.countryScope);
			research_elem.attr('citizen_country_name', $scope.countryNameScope);
			research_elem.attr('pickup_country_name', data.general_info.pickup_country_name);
			research_elem.attr('pickup_city', data.general_info.pickup_city);

			research_elem.html('<div class="ui right corner label favorites search" search-favorite-action><i class="heart icon"></i></div>');

			angular.forEach($scope.search_favorites, function(row, index) {
				if(row.id == tab_id) {
					research_elem.find('.corner.label').addClass('active');
				}
			});
			
			window.history.pushState({}, "New Param", "results?pDate=" + $scope.pickupDateScope + "&pTime=" + $scope.pickupTimeScope + "&rDate=" + $scope.returnDateScope + "&rTime=" + $scope.returnTimeScope + "&cCountryID=" + $scope.countryScope + "&age=" + $scope.ageScope + "&pLocID=" + $scope.pickupIdScope + "&rLocID=" + $scope.returnIdScope);
			
			research_elem.append($scope.pickupScope);
			research_elem.append("<p>" + $scope.pickupDateModel + " to " + $scope.returnDateModel + "</p>");

			$('.res.menu').find('.container').find('.item').removeClass('active');
			$('.res.menu').find('.container').append(research_elem);

			$compile(research_elem)($scope);

			$scope.current_selected_search = $('.res.menu').find('.container').find('.active.item').attr('search_id');

			$('.result.column').hide();
			$('.result.column.s-' + mainarr_length).fadeIn();


			angular.element($scope.page_dimmer).dimmer('hide');
			$('.column.grid.results').fadeIn();		

			
		}).error(function(data, status, headers, config) {
			alert('Failed to connect to Comms Layer. Please try again');
		});
	};
	*/

	getVehiclesStatic()

	function getVehiclesStatic(){

		data = {"vehicles":[{"vehicleElemID":"AU_AV_ECMR","hasAircon":0,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"AV","vehicleName":"Nissan Micra Or Similar","originalPrice":173.58,"price":"173.58","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":5,"storage":4},{"vehicleElemID":"AU_AV_CCMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"AV","vehicleName":"Toyota Yaris Or Similar","originalPrice":184.59,"price":"184.59","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"CCMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":2,"storage":9},{"vehicleElemID":"AU_AV_CCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"AV","vehicleName":"Hyundai i20 Or Similar","originalPrice":190.1,"price":"190.10","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":4,"storage":2},{"vehicleElemID":"AU_AV_ICAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Intermediate","classID":6,"supplierName":"AV","vehicleName":"Hyundai i30 Or Similar","originalPrice":201.12,"price":"201.12","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"ICAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":10},{"vehicleElemID":"AU_AV_SCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Standard","classID":7,"supplierName":"AV","vehicleName":"Holden Cruze Or Similar","originalPrice":206.64,"price":"206.64","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"SCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":4601,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":7,"storage":6},{"vehicleElemID":"AU_BG_MCMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Mini","classID":1,"supplierName":"BG","vehicleName":"Nissan Micra Or Similar","originalPrice":177.36,"price":"177.36","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"MCMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":10},{"vehicleElemID":"AU_BG_ECMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"BG","vehicleName":"Nissan Micra Or Similar","originalPrice":187.86,"price":"187.86","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":10},{"vehicleElemID":"AU_BG_CCAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"BG","vehicleName":"Nissan Micra Auto Or Similar","originalPrice":198.32,"price":"198.32","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CCAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":9},{"vehicleElemID":"AU_BG_ICAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Intermediate","classID":6,"supplierName":"BG","vehicleName":"Kia Cerato Or Similar","originalPrice":207.35,"price":"207.35","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"ICAR","distance":"Unlimited","door_count":0,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":6,"storage":2},{"vehicleElemID":"AU_BG_SDAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Standard","classID":7,"supplierName":"BG","vehicleName":"Mitsubishi Lancer Es Or Similar","originalPrice":221.67,"price":"221.67","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"SDAR","distance":"Unlimited","door_count":4,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":5260,"inAirport":1,"lon":153.11806,"lat":-27.383333,"address":"Arrivals Terminal"},"capacity":9,"storage":2},{"vehicleElemID":"AU_EC_CDAR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":219.59,"price":"219.59","is_shown":1,"transmission":{"id":1,"name":"AT","fullname":"Automatic Transmission"},"sippID":"CDAR","distance":"UNLIMITED","door_count":5,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":9,"storage":2},{"vehicleElemID":"AU_EC_ECMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Economy","classID":3,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":195.17,"price":"195.17","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"ECMR","distance":"UNLIMITED","door_count":3,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":8,"storage":7},{"vehicleElemID":"AU_EC_CDMR","hasAircon":1,"categoryName":"Car","categoryID":1,"class":"Compact","classID":4,"supplierName":"EC","vehicleName":"Hyundai i20","originalPrice":219.15,"price":"219.15","is_shown":1,"transmission":{"id":2,"name":"MT","fullname":"Manual Transmission"},"sippID":"CDMR","distance":"UNLIMITED","door_count":5,"userDistance":"","originalCurrency":"AUD","currency":"AUD","depot_information":{"depotId":10948,"inAirport":1,"lon":153.1097,"lat":-27.404,"address":"Arrivals Terminal"},"capacity":10,"storage":7}],"filters":{"price":{"identifier":"price","max":"221.67","min":"173.58","value":{"min":"","max":""}},"userDistance":{"identifier":"userDistance","max":0,"min":0,"value":{"min":"","max":""}},"aircon":{"identifier":"hasAircon","choices":[true,false],"value":""},"transmission":{"identifier":"transmission","choices":[{"id":1,"name":"AT"},{"id":2,"name":"MT"},{"id":"","name":"All"}],"value":""},"distance":{"identifier":"distance","choices":[true,false],"value":""},"airport":{"identifier":{"parent":"depot_information","index":"inAirport"},"choices":[true,false],"value":""},"capacity":{"identifier":"capacity","max":10,"min":2,"value":{"min":"","max":""}},"door":{"identifier":"door_count","max":5,"min":3,"value":{"min":"","max":""}},"storage":{"identifier":"storage","max":10,"min":2,"value":{"min":"","max":""}},"class":{"identifier":"classID","choices":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}],"value":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}]},"category":{"identifier":"categoryID","choices":[{"id":1,"name":"Car"}],"value":[{"id":1,"name":"Car"}]},"supplier":{"identifier":"supplierName","choices":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}],"value":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}]},"depot":{"identifier":"depot_information","choices":[{"id":4601,"name":"Arrivals Terminal","supplierName":"AV","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":5260,"name":"Arrivals Terminal","supplierName":"BG","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":10948,"name":"Arrivals Terminal","supplierName":"EC","coordinates":{"lat":-27.404,"lng":153.1097},"userDistance":""}],"value":[{"id":4601,"name":"Arrivals Terminal"},{"id":5260,"name":"Arrivals Terminal"},{"id":10948,"name":"Arrivals Terminal"}]}},"defaultFilter":{"price":{"identifier":"price","max":"221.67","min":"173.58","value":{"min":"","max":""}},"userDistance":{"identifier":"userDistance","max":0,"min":0,"value":{"min":"","max":""}},"aircon":{"identifier":"hasAircon","choices":[true,false],"value":""},"transmission":{"identifier":"transmission","choices":[{"id":1,"name":"AT"},{"id":2,"name":"MT"},{"id":"","name":"All"}],"value":""},"distance":{"identifier":"distance","choices":[true,false],"value":""},"airport":{"identifier":{"parent":"depot_information","index":"inAirport"},"choices":[true,false],"value":""},"capacity":{"identifier":"capacity","max":10,"min":2,"value":{"min":"","max":""}},"door":{"identifier":"door_count","max":5,"min":3,"value":{"min":"","max":""}},"storage":{"identifier":"storage","max":10,"min":2,"value":{"min":"","max":""}},"class":{"identifier":"classID","choices":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}],"value":[{"id":3,"name":"Economy"},{"id":4,"name":"Compact"},{"id":6,"name":"Intermediate"},{"id":7,"name":"Standard"},{"id":1,"name":"Mini"}]},"category":{"identifier":"categoryID","choices":[{"id":1,"name":"Car"}],"value":[{"id":1,"name":"Car"}]},"supplier":{"identifier":"supplierName","choices":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}],"value":[{"id":"AV","name":"AV"},{"id":"BG","name":"BG"},{"id":"EC","name":"EC"}]},"depot":{"identifier":"depot_information","choices":[{"id":4601,"name":"Arrivals Terminal","supplierName":"AV","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":5260,"name":"Arrivals Terminal","supplierName":"BG","coordinates":{"lat":-27.383333,"lng":153.11806},"userDistance":""},{"id":10948,"name":"Arrivals Terminal","supplierName":"EC","coordinates":{"lat":-27.404,"lng":153.1097},"userDistance":""}],"value":[{"id":4601,"name":"Arrivals Terminal"},{"id":5260,"name":"Arrivals Terminal"},{"id":10948,"name":"Arrivals Terminal"}]}},"general_info":{"pickup_country_name":"Australia","pickup_city":"Brisbane"}};

		var min_price;
		var max_price;

		var min_capacity;
		var max_capacity;

		var min_door_count;
		var max_door_count;

		var min_storage;
		var max_storage;

		min_price = 0;
		max_price = 0;
		min_capacity = 0;
		max_capacity = 0;
		min_door_count = 0;
		max_door_count = 0;
		min_storage = 0;
		max_storage = 0;
		min_user_distance = 0;
		max_user_distance = 0;

		var shown_suppliers = [];
		var shown_classes = [];
		var shown_categories = [];

		var rr_filters = {
			transmission: {
				choices: {
					automatic: 1,
					manual: 2,
					not_specified: ''
				},
				value: ''
			},
			aircon: {
				choices: {
					has_aircon: 1,
					has_no_aircon: 0
				},
				value: ''
			},
			airport: {
				choices: {
					in_airport: 1,
					not_in_airport: 0
				},
				value: ''	
			},
			/*class:  {
				choices: {
					mini: 1,
					economy: 3,
					compact: 4,
					midSize: 5,
					intermediate: 6,
					standard: 7,
					fullSize: 8,
					luxury: 9,
					premium: 10
				},
				headers: [
					'Mini',
					'Economy',
					'Compact',
					'Mid Size',
					'Intermediate',
					'Standard',
					'Full Size',
					'Luxury',
					'Premium'
				],
				value: []
			},	*/		
			class:  {
				choices: [],					
				value: []
			},	
			category: {
				choices: [],
				value: []
			},
			price: {
				choices: {
					min_value: min_price,
					max_value: max_price
				},
				value: ''
			},
			user_distance: {
				choices: {
					min_value: min_user_distance,
					max_value: max_user_distance
				},
				value: ''
			},
			capacity: {
				choices: {
					min_value: min_capacity,
					max_value: max_capacity
				},
				value: ''
			},
			door_count: {
				choices: {
					min_value: min_door_count,
					max_value: max_door_count
				},
				value: ''
			},
			storage: {
				choices: {
					min_value: min_storage,
					max_value: max_storage
				},
				value: ''
			},
			supplier: {
				choices: [],
				value: []
			}
		};

		var found_class;
		var found_category;

		angular.forEach(data.vehicles, function(row, index) {
			
			/* compute max min storage */
			if(min_storage == 0) {
				min_storage = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(row['capacity']) < parseFloat(min_storage)) {
					min_storage = data.vehicles[index]['capacity'];
				}
			}

			if(max_storage == 0) {
				max_storage = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_storage)) {
					max_storage = data.vehicles[index]['capacity'];
				}
			}

			/* compute max min door count */
			if(min_door_count == 0) {
				min_door_count = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(row['capacity']) < parseFloat(min_door_count)) {
					min_door_count = data.vehicles[index]['capacity'];
				}
			}

			if(max_door_count == 0) {
				max_door_count = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_door_count)) {
					max_door_count = data.vehicles[index]['capacity'];
				}
			}

			/* compute max min capacity */
			if(min_capacity == 0) {
				min_capacity = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(row['capacity']) < parseFloat(min_capacity)) {
					min_capacity = data.vehicles[index]['capacity'];
				}	
			}

			if(max_capacity == 0) {
				max_capacity = data.vehicles[index]['capacity'];
			} else {
				if(parseFloat(data.vehicles[index]['capacity']) > parseFloat(max_capacity)) {
					max_capacity = data.vehicles[index]['capacity'];
				}
			}

			/* compute max min price */
			if(min_price == 0) {
				min_price = data.vehicles[index]['price'];
			} else {
				if(parseFloat(row['price']) < parseFloat(min_price)) {
					min_price = data.vehicles[index]['price'];
				}	
			}

			if(max_price == 0) {
				max_price = data.vehicles[index]['price'];
			} else {
				if(parseFloat(data.vehicles[index]['price']) > parseFloat(max_price)) {
					max_price = data.vehicles[index]['price'];
				}
			}

			data.vehicles[index]['is_shown'] = true;
			data.vehicles[index]['is_favorite'] = false;
			data.vehicles[index]['special'] = '';
			data.vehicles[index]['extra'] = '';
			data.vehicles[index]['user_distance'] = 0;

			if(data.vehicles[index]['vehicleName'].match(/mystery/gi)) {
				data.vehicles[index]['special'] = 'mystery';
			}
			
			if(shown_suppliers.indexOf(data.vehicles[index]['supplierName']) == -1) {
				shown_suppliers.push(data.vehicles[index]['supplierName']);
			}

			found_class = shown_classes.some(function(obj) {
				return obj.id == data.vehicles[index]['classID']
			});

			found_category = shown_categories.some(function(obj) {
				return obj.id == data.vehicles[index]['categoryID']
			});

			if(!found_class) {
				shown_classes.push({
					id: data.vehicles[index]['classID'],
					name: data.vehicles[index]['class']
				});
			}

			if(!found_category) {
				shown_categories.push({
					id: data.vehicles[index]['categoryID'],
					name: data.vehicles[index]['categoryName']
				});
			}

			if(data.vehicles[index]['price'] > 60 && data.vehicles[index]['price'] < 70) {
				data.vehicles[index]['extra'] = 'featured';
			} else if(data.vehicles[index]['price'] > 70 && data.vehicles[index]['price'] < 80) {
				data.vehicles[index]['extra'] = 'discounted';
			} else if(data.vehicles[index]['price'] > 80 && data.vehicles[index]['price'] < 90) {
				data.vehicles[index]['extra'] = 'best';
			} else if(data.vehicles[index]['price'] > 90 && data.vehicles[index]['price'] < 100) {
				data.vehicles[index]['extra'] = 'popular';
			}

			angular.forEach(car_favorites, function(fav_row, fav_index) {
				if(fav_row.id == row.vehicleElemID) {
					data.vehicles[index]['is_favorite'] = true;
				} 
			})						
		});
		
				
		rr_filters.supplier.choices = shown_suppliers;
		rr_filters.class.choices = shown_classes;
		rr_filters.category.choices = shown_categories;

				
		var research_elem;
		var mainarr_length;	
		
		mainarr_length = $scope.main_arr.length;
		$scope.main_arr[mainarr_length] = {};
		$scope.main_arr[mainarr_length]['lat'] = '';
		$scope.main_arr[mainarr_length]['lon'] = '';
		$scope.main_arr[mainarr_length]['address'] = '';
		$scope.main_arr[mainarr_length]['arr_filters'] = rr_filters;
		$scope.main_arr[mainarr_length]['vehicles'] = data.vehicles;
		$scope.main_arr[mainarr_length]['class'] = 's-' + mainarr_length;
		$scope.main_arr[mainarr_length]['shown_suppliers'] = shown_suppliers;
		$scope.main_arr[mainarr_length]['min_price'] = min_price;
		$scope.main_arr[mainarr_length]['max_price'] = max_price;

		$scope.main_arr[mainarr_length]['min_capacity'] = min_capacity;
		$scope.main_arr[mainarr_length]['max_capacity'] = max_capacity;

		$scope.main_arr[mainarr_length]['min_door_count'] = min_door_count;
		$scope.main_arr[mainarr_length]['max_door_count'] = max_door_count;

		$scope.main_arr[mainarr_length]['min_storage'] = min_storage;
		$scope.main_arr[mainarr_length]['max_storage'] = max_storage;

		$scope.main_arr[mainarr_length]['min_user_distance'] = 0;
		$scope.main_arr[mainarr_length]['max_user_distance'] = 0;

		$scope.main_arr[mainarr_length]['user_distance_filter'] = true;

		
		var tab_id = $scope.pickupIdScope + '_' + $scope.returnIdScope + '_' + $scope.pickupDateScope + '_' + $scope.pickupTimeScope + '_' + $scope.returnDateScope + '_' + $scope.returnTimeScope + '_' + $scope.ageScope + '_' + $scope.countryScope;
					
		research_elem = $("<a tab-item-action />");
		research_elem.attr('id', 'search-' + tab_id);
		research_elem.addClass('active item');
		research_elem.attr('search_id', mainarr_length);
		

		research_elem.attr('datetime_text', $scope.pickupDateModel + " to " + $scope.returnDateModel);
		research_elem.attr('pickup_date', $scope.pickupDateScope);
		research_elem.attr('pickup_time', $scope.pickupTimeScope);

		research_elem.attr('return_date', $scope.returnDateScope);
		research_elem.attr('return_time', $scope.returnTimeScope);

		research_elem.attr('pickup_place_name', $scope.pickupScope);

		research_elem.attr('pickup_place', $scope.pickupIdScope);
		research_elem.attr('return_place', $scope.returnIdScope);

		research_elem.attr('age', $scope.ageScope);
		
		research_elem.attr('citizen_country', $scope.countryScope);
		research_elem.attr('citizen_country_name', $scope.countryNameScope);
		research_elem.attr('pickup_country_name', data.general_info.pickup_country_name);
		research_elem.attr('pickup_city', data.general_info.pickup_city);

		research_elem.html('<div class="ui right corner label favorites search" search-favorite-action><i class="heart icon"></i></div>');

		angular.forEach($scope.search_favorites, function(row, index) {
			if(row.id == tab_id) {
				research_elem.find('.corner.label').addClass('active');
			}
		});
		
		window.history.pushState({}, "New Param", "results?pDate=" + $scope.pickupDateScope + "&pTime=" + $scope.pickupTimeScope + "&rDate=" + $scope.returnDateScope + "&rTime=" + $scope.returnTimeScope + "&cCountryID=" + $scope.countryScope + "&age=" + $scope.ageScope + "&pLocID=" + $scope.pickupIdScope + "&rLocID=" + $scope.returnIdScope);
		
		research_elem.append($scope.pickupScope);
		research_elem.append("<p>" + $scope.pickupDateModel + " to " + $scope.returnDateModel + "</p>");

		$('.res.menu').find('.container').find('.item').removeClass('active');
		$('.res.menu').find('.container').append(research_elem);

		$compile(research_elem)($scope);

		$scope.current_selected_search = $('.res.menu').find('.container').find('.active.item').attr('search_id');

		$('.result.column').hide();
		$('.result.column.s-' + mainarr_length).fadeIn();


		angular.element($scope.page_dimmer).dimmer('hide');
		$('.column.grid.results').fadeIn();
	}

	angular.element(page_dimmer).dimmer({
		closable: false	
	});
	
	angular.element(page_dimmer).dimmer('show');
	$('.column.grid.results').hide();

	$scope.get_results();

	$('html').click(function(e) {
		//Hide the menus if visible
		var to_hide;
		to_hide = false;

		if($('.ui.popup').length > 0) {
			if($('.ui.popup').attr('class') != $(e.target).attr('class') && $(e.target).closest('.ui.popup').attr('class') != $('.ui.popup').attr('class') && $(e.target).closest('.datepick').length == 0) {
				if($(e.target).attr('id') != 'returnDate') {
					if($(e.target).attr('id') != 'pickupDate') {						
						to_hide = true;
					}					
				}

				if($(e.target).attr('id') != 'pickupDate') {
					if($(e.target).attr('id') != 'returnDate') {						
						to_hide = true;
					}					
				}
			}	
		}	

		if(to_hide) {
			$('.pdate').popup('hide');
		}
	});	

	
	$scope.main_search_favorite_action = function($event) {
		var elem = $($event.target);
		var id = elem.closest('.item').attr('id').replace('favorite-', '');
		var to_proceed;

		to_proceed = true;

		$.each($('.tabular.res').find('.item'), function() {
			if($(this).attr('id').replace('search-', '') == id) {				
				alert('Tab is already existing.');
				to_proceed = false;
			}
		});	

		

		if(to_proceed) {
			angular.forEach($scope.search_favorites, function(row, index) {
				if(row.id == id) {										
					$scope.pickupScope = row.pickup_place_name;
					$scope.ageScope = row.age;
					$scope.countryScope = row.citizen_country;
					$scope.pickupIdScope = row.pickup_place;
					$scope.returnIdScope = row.return_place;
					$scope.pickupDateScope = row.pickup_date;
					$scope.returnDateScope = row.return_date;
					$scope.pickupTimeScope = row.pickup_time;
					$scope.returnTimeScope = row.return_time;
					

					angular.element($scope.page_dimmer).dimmer('show');						
					$('.column.grid.results').hide();

					$scope.update_search_form();					
					$scope.get_results();
				}
			});
		}
	}

	$scope.address_autocomplete_action = function($event) {


		if($event.target != undefined) {
			var obj = $($event.target);	
		} else {
			var obj = $event;
		}
		
		var lat = obj.attr('lat');
		var lon = obj.attr('lon');

		$scope.$apply(function() {
			$scope.main_arr[$scope.current_selected_search].lat = lat;
			$scope.main_arr[$scope.current_selected_search].lon = lon;
			$scope.main_arr[$scope.current_selected_search].address = obj.html();
			if(obj.closest('table').hasClass('single')) {
				obj.closest('table').prev().val(obj.html());
				$scope.setUserLocation();
			}
			$scope.main_arr[$scope.current_selected_search].user_distance_filter = false;
		});
		
		$('.s-' + $scope.current_selected_search).find('.txt.address').val(obj.html());
		obj.closest('table').hide();
	};

	$scope.autocomplete_action = function($event) {

		if($event.target != undefined) {
			var obj = $($event.target);	
		} else {
			var obj = $event;
		}
		
		var loc_id = obj.attr('id');
		var place_text = obj.find('.place.span').attr('place');

		$scope.$apply(function() {
			$scope.pickupIdScope = loc_id;
			$scope.returnIdScope = loc_id;
			$scope.pickupScope = place_text;	
		});
		

		obj.closest('table').hide(400, function() {
			$('#pickupDate').focus();
		});
	};

	/*$scope.pick_place = function(el) {
		var obj;

		if(el.length > 0) {
			obj = el;
		} else {
			obj = $(this);
		}

		$('.pickup.place').find('input').attr('loc_id', obj.attr('id'));
		
		obj.closest('table').prev().val(obj.find('.place.span').attr('place'));
		obj.closest('table').hide(400, function() {
			$('#pickupDate').focus();
		});		
	}*/

}).controller('MArrController', function($scope) {
	
	$scope.$watch('car_favorites', function() {
		angular.forEach($scope.main_arr[$scope.current_selected_search].vehicles, function(veh_row, veh_index) {
			$scope.main_arr[$scope.current_selected_search].vehicles[veh_index].is_favorite = false;

			angular.forEach($scope.car_favorites, function(favorite_row, favorite_index) {			
				if(veh_row.vehicleElemID == favorite_row.id) {					
					$scope.main_arr[$scope.current_selected_search].vehicles[veh_index].is_favorite = true;
				}
			});			
		});
	}, true);
	
	$scope.$watch('mArr.address', function(newValue, oldvalue) {

		if(newValue != '') {
			var origin = new google.maps.LatLng($scope.main_arr[$scope.current_selected_search].lat, $scope.main_arr[$scope.current_selected_search].lon);
			
			angular.forEach($scope.main_arr[$scope.current_selected_search].vehicles, function(veh_row, veh_index) {
				var destination = new google.maps.LatLng(veh_row.depot_information.lat, veh_row.depot_information.lon);
				var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
				
				/*$scope.main_arr[$scope.current_selected_search].vehicles[veh_index].user_distance = Math.round(distance/1000);*/
				distance = distance / 1000;
				$scope.main_arr[$scope.current_selected_search].vehicles[veh_index].user_distance = Math.round(distance);
			});
		}
	});

	$scope.$watch('mArr.arr_filters', function(newValue, oldvalue) {
		var to_show;
		var all_filters = $scope.main_arr[$scope.current_selected_search]['arr_filters'];

		var min_price = 0;
		var max_price = 0;
		var min_capacity = 0;
		var max_capacity = 0;
		var min_door_count = 0;
		var max_door_count = 0;
		var min_storage = 0;
		var max_storage = 0;
		var min_user_distance = 0;
		var max_user_distance = 0;

		/*angular.element('body').animate({
	    	scrollTop: 0
		},500);*/
		
		angular.forEach($scope.main_arr[$scope.current_selected_search].vehicles, function(vehicle_row, vehicle_index) {			
			
			to_show = true;

			if(all_filters.transmission.value != '') {
				if(all_filters.transmission.value != vehicle_row.transmission) {
					to_show = false;
				}
			};
				
			if(all_filters.aircon.value != '') {
				if(all_filters.aircon.value != vehicle_row.hasAircon) {
					to_show = false;
				}
			}

			if(all_filters.airport.value != '') {
				if(all_filters.airport.value != vehicle_row.depot_information.inAirport) {
					to_show = false;
				}
			}

			if(all_filters.class.value.length > 0) {
				if(all_filters.class.value.indexOf(vehicle_row.classID.toString()) == -1) {
					to_show = false;
				}
			}

			if(all_filters.supplier.value.length > 0) {
				if(all_filters.supplier.value.indexOf(vehicle_row.supplierName.toString()) == -1) {
					to_show = false;
				}
			}

			if(all_filters.category.value.length > 0) {
				if(all_filters.category.value.indexOf(vehicle_row.categoryID.toString()) == -1) {
					to_show = false;
				}
			}

			if(all_filters.price.value != '') {
				if(parseFloat(vehicle_row.price) > parseFloat(all_filters.price.value)) {
					to_show = false;
				}
			}

			if(all_filters.user_distance.value != '') {
				if(parseFloat(vehicle_row.user_distance) > parseFloat(all_filters.user_distance.value)) {
					to_show = false;
				}
			}

			if(all_filters.capacity.value != '') {
				if(parseFloat(vehicle_row.capacity) > parseFloat(all_filters.capacity.value)) {
					to_show = false;
				}
			}

			if(all_filters.door_count.value != '') {
				if(parseFloat(vehicle_row.capacity) > parseFloat(all_filters.door_count.value)) {
					to_show = false;
				}
			}

			if(all_filters.storage.value != '') {
				if(parseFloat(vehicle_row.capacity) > parseFloat(all_filters.storage.value)) {
					to_show = false;
				}
			}

			
			if(to_show) {

				/* price */
				if(min_price == 0) {
					min_price = vehicle_row.price;
				}

				if(max_price == 0) {
					max_price = vehicle_row.price;
				}

				if(parseFloat(vehicle_row.price) < parseFloat(min_price)) {
					min_price = vehicle_row.price;
				}

				if(parseFloat(vehicle_row.price) > parseFloat(max_price)) {
					max_price = vehicle_row.price;
				}

				/* user distance */
				if(min_user_distance == 0) {
					min_user_distance = vehicle_row.user_distance;
				}

				if(max_user_distance == 0) {
					max_user_distance = vehicle_row.user_distance;
				}

				if(parseFloat(vehicle_row.user_distance) < parseFloat(min_user_distance)) {
					min_user_distance = vehicle_row.user_distance;
				}

				if(parseFloat(vehicle_row.user_distance) > parseFloat(max_user_distance)) {
					max_user_distance = vehicle_row.user_distance;
				}


				/* capacity */
				if(min_capacity == 0) {
					min_capacity = vehicle_row.capacity;
				}

				if(max_capacity == 0) {
					max_capacity = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) < parseFloat(min_capacity)) {
					min_capacity = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) > parseFloat(max_capacity)) {
					max_capacity = vehicle_row.capacity;
				}

				/* door count */
				if(min_door_count == 0) {
					min_door_count = vehicle_row.capacity;
				}

				if(max_door_count == 0) {
					max_door_count = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) < parseFloat(min_door_count)) {
					min_door_count = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) > parseFloat(max_door_count)) {
					max_door_count = vehicle_row.capacity;
				}

				/* storage */
				if(min_storage == 0) {
					min_storage = vehicle_row.capacity;
				}

				if(max_storage == 0) {
					max_storage = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) < parseFloat(min_storage)) {
					min_storage = vehicle_row.capacity;
				}

				if(parseFloat(vehicle_row.capacity) > parseFloat(max_storage)) {
					max_storage = vehicle_row.capacity;
				}


				$scope.main_arr[$scope.current_selected_search].vehicles[vehicle_index].is_shown = true;
				$('.result.column.s-' + $scope.current_selected_search).find('#' + vehicle_row.vehicleElemID).slideDown();
			} else {				
				$scope.main_arr[$scope.current_selected_search].vehicles[vehicle_index].is_shown = false;
				$('.result.column.s-' + $scope.current_selected_search).find('#' + vehicle_row.vehicleElemID).slideUp();
			}		
		});
		
		/*$scope.main_arr[$scope.current_selected_search].min_price = min_price;
		$scope.main_arr[$scope.current_selected_search].max_price = max_price;

		$scope.main_arr[$scope.current_selected_search].min_capacity = min_capacity;
		$scope.main_arr[$scope.current_selected_search].max_capacity = max_capacity;

		$scope.main_arr[$scope.current_selected_search].min_door_count = min_door_count;
		$scope.main_arr[$scope.current_selected_search].max_door_count = max_door_count;

		$scope.main_arr[$scope.current_selected_search].min_storage = min_storage;
		$scope.main_arr[$scope.current_selected_search].max_storage = max_storage;*/
	}, true);
});

vroomApp.directive('currencyAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.dropdown();
		}
	};
});

vroomApp.directive('trAutocompleteAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				scope.autocomplete_action($(this).find('td'));
			});

			elem.mouseover(function() {
				var tr;

				tr = $(this);
				scope.$apply(function() {
					scope.$parent.autocomplete_index = tr.parent().find('tr').index(tr);
				});
			});
		}
	};
});

vroomApp.directive('trCurrentAddressAutocompleteAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				scope.address_autocomplete_action($(this).find('td'));
			});

			elem.mouseover(function() {
				var tr;
				tr = $(this);
				scope.$apply(function() {
					scope.$parent.autocomplete_index = tr.parent().find('tr').index(tr);
				});
			});
		}
	};
});

vroomApp.directive('plotUserAddressAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.click(function() {

				scope.marker.setMap(null);

				var user_lat = scope.main_arr[scope.current_selected_search].lat;
				var user_lon = scope.main_arr[scope.current_selected_search].lon;

				var addressLatLng = new google.maps.LatLng(user_lat, user_lon);
				var marker = new google.maps.Marker({
				    position: addressLatLng,
				    map: scope.mapInstance,
				    icon: "http://maps.google.com/mapfiles/ms/icons/green.png",
				    title: "Hello World!"
				});

				var infowindow = new google.maps.InfoWindow();
				infowindow.setContent('Your Location');			

				google.maps.event.addListener(marker, 'click', function() {				
			    	infowindow.open(scope.mapInstance, marker);
			  	});

				/*$scope.markers.push({
					marker: marker, 
					infowindow: infowindow
				});*/
				scope.marker = marker;
			});			
		}
	};
});

vroomApp.directive('changeAddressAction', function() {
	return {
		restrict: 'A',		
		link: function(scope, elem, attrs) {
			scope.$watch(attrs.ngModel, function() {
				elem.attr('lat', scope.map_user_lat);
				elem.attr('lon', scope.map_user_lon);
			});
		}
	};
});

vroomApp.directive('saveAddressAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.click(function() {
				if(!elem.attr('disabled')) {
					scope.$apply(function() {
						scope.main_arr[scope.current_selected_search].lat = elem.closest('.ui.form').find('input').attr('lat');
						scope.main_arr[scope.current_selected_search].lon = elem.closest('.ui.form').find('input').attr('lon');
					});
					$('.button.save.address').addClass('disabled');
				}
			});
		}
	};
});

vroomApp.directive('filterSliderAction', function() {
	return {
		link: function(scope, elem ,attrs) {
			/*var min = attrs.min;
			var max = attrs.max;
			var attribute = attrs.attribute;*/

			scope.$watch('mArr.arr_filters', function(row, index) {

				if(scope.moved != attrs.attribute) {
					/*elem.ionRangeSlider('update', {
						min: parseFloat(scope.main_arr[scope.current_selected_search][attrs.min]),
						max: parseFloat(scope.main_arr[scope.current_selected_search][attrs.max])
						from: parseFloat(scope.main_arr[scope.current_selected_search][attrs.max]),
						to: parseFloat(scope.main_arr[scope.current_selected_search][attrs.max])
					});*/
				}
			}, true);

			/*$.each($('.s-' + $scope.current_selected_search).find('input.filter'), function(index, obj) {
				var obj2 = $(obj);

				obj2.ionRangeSlider('update', {
					min: parseFloat($scope.main_arr[$scope.current_selected_search][obj2.attr('min')]),
					max: parseFloat($scope.main_arr[$scope.current_selected_search][obj2.attr('max')]),
					from: parseFloat($scope.main_arr[$scope.current_selected_search][obj2.attr('max')])
				});
			});*/
			elem.ionRangeSlider('update', {
				min: parseFloat(scope.main_arr[scope.current_selected_search][attrs.min]),
				max: parseFloat(scope.main_arr[scope.current_selected_search][attrs.max]),
				from: parseFloat(scope.main_arr[scope.current_selected_search][attrs.max]),
				onChange: function(obj) {
					var val = obj.fromNumber;

					/*elem.ionRangeSlider('update', {
						to: scope.main_arr[scope.current_selected_search][attrs.max]
					});*/
					scope.$apply(function() {
						scope.main_arr[scope.current_selected_search]['arr_filters'][attrs.attribute].value = val;
						scope.moved = attrs.attribute;
					});					
				}
			});
		}
	};
});

vroomApp.directive('mainSearchFavoriteAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {		
				var id = elem.attr('id').replace('favorite-', '');
				var abort_search = false;

				if($('#search-' + id).length > 0) {
					alert('Tab is already existing.');
					return false;
				}

				angular.forEach(scope.search_favorites, function(row, index) {
					if(row.id == id) {

						if(row.return_date < current_date) {
							abort_search = true
						}

						if(!abort_search) {
							scope.$apply(function() {
								scope.pickupScope = row.pickup_place_name;
								scope.ageScope = row.age;
								scope.countryScope = row.citizen_country;
								scope.pickIdScope = row.pickup_place;
								scope.pickupDateScope = row.pickup_date;
								scope.returnDateScope = row.return_date;
								scope.pickupTimeScope = row.pickup_time;
								scope.returnTimeScope = row.return_time;								
							});
							

							angular.element(scope.page_dimmer).dimmer('show');						
							$('.column.grid.results').hide();

							scope.update_search_form();					
							scope.get_results();
						} else {
							alert("Search is a past date. Aborting Search");
						}
					}
				});
			});
		}
	};
});

vroomApp.directive('loginAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
		
			elem.click(function() {

			});
		}
	};
});

vroomApp.directive('sortAction', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			$timeout(function() {
				elem.dropdown({
					onChange: function(value, text) {
						scope.$apply(function() {
							scope.sort.column = value;
						});
					}
				});
			}, 200);
			
		}
	};
});

vroomApp.directive('sortTypeCheckboxAction', function() {
	return {
		restrict: 'A',	
		link: function(scope, elem, attrs) {
			elem.checkbox({
				onEnable: function() {
					scope.$apply(function() {
						scope.sort.reverse = true;
					});
				},
				onDisable: function() {
					scope.$apply(function() {
						scope.sort.reverse = false;
					});
				}
			});	
		}
	};
});

vroomApp.directive('userDistanceSliderAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			scope.$watch('mArr.address', function(newValue, oldValue) {
				var min_user_distance = 0;
				var max_user_distance = 0;

				scope.$watch('mArr.vehicles', function(newValue, oldValue) {

					angular.forEach(newValue, function(veh_row, veh_value) {
						if(min_user_distance == 0) {
							min_user_distance = veh_row['user_distance'];
						} else {
							if(parseFloat(veh_row['user_distance']) < parseFloat(min_user_distance)) {
								min_user_distance = veh_row['user_distance'];
							}	
						}

						if(max_user_distance == 0) {
							max_user_distance = veh_row['user_distance'];
						} else {
							if(parseFloat(veh_row['user_distance']) > parseFloat(max_user_distance)) {
								max_user_distance = veh_row['user_distance'];
							}
						}
					});
					scope.main_arr[scope.current_selected_search]['min_user_distance'] = min_user_distance;
					scope.main_arr[scope.current_selected_search]['max_user_distance'] = max_user_distance;

					/*scope.main_arr[scope.current_selected_search]['min_user_distance'] = Math.round(parseFloat(min_user_distance));
					scope.main_arr[scope.current_selected_search]['max_user_distance'] = Math.round(parseFloat(max_user_distance));*/

					elem.ionRangeSlider('update', {
						disable: scope.main_arr[scope.current_selected_search]['user_distance_filter'],
						min: scope.main_arr[scope.current_selected_search]['min_user_distance'],
						max: scope.main_arr[scope.current_selected_search]['max_user_distance'],
						from: scope.main_arr[scope.current_selected_search]['max_user_distance']
					});
				});				
			});
		}
	};
});

vroomApp.directive('mapViewAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				if(!$('.ui.modal.map').hasClass('transition')) {					
					$('.ui.modal.map').modal({
						closable: false
					});					
				} 

				$('.ui.modal.map').modal('setting', {
					onHidden: function() {
						scope.$apply(function() {
							angular.forEach(scope.markers, function(obj, i) {
								obj.marker.setMap(null);
							});
							scope.marker.setMap(null);
						});
					},
					onVisible: function() {

						$('.ui.modal.map').find('.txt.address').val(scope.main_arr[scope.current_selected_search].address);

						var vehicles = scope.main_arr[scope.current_selected_search]['vehicles'];						
						var coordinates;

						scope.$apply(function() {
							scope.markers = [];
						});

						coordinates = new Array();

						$(this).find('.header').html('');

						google.maps.event.trigger(scope.mapInstance, 'resize');

						var to_add_coordinate;
						var to_add_supplier;
						angular.forEach(vehicles, function(obj, row) {

							if(obj.is_shown) {
								var coordinate = {
									lat: obj.depot_information.lat,
									lon: obj.depot_information.lon,
									suppliers: [{
										name: obj.supplierName,
										count: 1,
										min_price: obj.price
									}]
								};

								to_add_coordinate = true;

								for(var i = 0; i < coordinates.length; i++) {
									to_add_supplier = true;
									if(coordinates[i].lat == coordinate.lat && coordinates[i].lon == coordinate.lon) {
										/*same spot */
										for(var x = 0; x < coordinates[i].suppliers.length; x++) {
											if(coordinates[i].suppliers[x].name == coordinate.suppliers[0].name) {
												coordinates[i].suppliers[x].count++;
												to_add_supplier = false;

												if(coordinate.suppliers[0].min_price < coordinates[i].suppliers[x].min_price) {
													coordinates[i].suppliers[x].min_price = coordinate.suppliers[0].min_price;
												}
											}								
										}
										to_add_coordinate = false;

										if(to_add_supplier) {
											coordinates[i].suppliers.push(coordinate.suppliers[0]);
										}
									}							
								}
			
								if(coordinates.length == 0) {
									coordinates.push(coordinate);
								} else {
									if(to_add_coordinate) {
										coordinates.push(coordinate);
									}
								}
							}
						});
					
						var contentString;

						for(var i = 0; i < coordinates.length; i++) {

							marker = null;
						  	addressLatLng = null;
						  	infowindow = null;

							var addressLatLng = new google.maps.LatLng(coordinates[i].lat, coordinates[i].lon);
							var marker = new google.maps.Marker({
							    position: addressLatLng,
							    map: scope.mapInstance,
							    title:"Hello World!"
							});

							contentString = "<table class='ui table segment'> \
  								<thead> \
									<tr> \
										<th>Supplier</th> \
    									<th>Total Cars</th> \
    									<th>Minimum Price</th> \
  									</tr> \
  								</thead> \
  								<tbody>";

  							for(var x = 0; x < coordinates[i].suppliers.length; x++) {
  								contentString += " \
  								<tr> \
      									<td><img src='img/suppliers/icon-" + coordinates[i].suppliers[x].name + ".gif' /></td> \
      									<td>" + coordinates[i].suppliers[x].count + "</td> \
      									<td>" + coordinates[i].suppliers[x].min_price + "</td> \
    								</tr> \
    							";
  							}
  							contentString += "\
  								</tbody> \
							</table>";

							var infowindow = new google.maps.InfoWindow();

							infowindow.setContent(contentString);

							scope.$apply(function() {
								scope.markers.push({
									marker: marker,
									infowindow: infowindow
								});	
							});																			  
						}


						angular.forEach(scope.markers, function(obj, i) {
							google.maps.event.addListener(obj.marker, 'click', function() {

								angular.forEach(scope.markers, function(obj2, i2) {
									obj2.infowindow.close();
								});
						    	obj.infowindow.open(scope.mapInstance, obj.marker);
						  	});
						});

						scope.setUserLocation();
						if(coordinates.length > 0) {
							scope.mapInstance.setCenter(new google.maps.LatLng(coordinates[0].lat, coordinates[0].lon));
						}

						scope.mapInstance.setZoom(14);
					},
					closable: false
				}).modal('show');
			});
		}
	};
});

vroomApp.directive('showMapAction', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {

				if(!$('.ui.modal.map').hasClass('transition')) {					
					$('.ui.modal.map').modal({
						closable: false
					});					
				} 

				$('.ui.modal.map').modal('setting', {
					onHidden: function() {
						scope.$apply(function() {						
							scope.marker.setMap(null);
						});
					},
					onVisible: function() {						
						$(this).find('.header').html(attrs.address);
						$('.ui.modal.map').find('.txt.address').val(scope.main_arr[scope.current_selected_search].address);
						google.maps.event.trigger(scope.mapInstance, 'resize');
						var addressLatLng = new google.maps.LatLng(attrs.lat, attrs.lng);
						var marker = new google.maps.Marker({
						    position: addressLatLng,
						    map: scope.mapInstance,
						    title:"Hello World!"
						});
						
						scope.$apply(function() {
							scope.marker = marker;
						});

						scope.setUserLocation();									
						scope.mapInstance.setCenter(addressLatLng);
						scope.mapInstance.setZoom(scope.map.zoom);
					},
					closable: false
				}).modal('show');
				
			});
		}
	};
});

vroomApp.directive('scrollToTopAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.hide();

			$(window).scroll(function() {				
				console.log();
				if($(document).scrollTop() >= ($(document).height()/5)) {
					elem.fadeIn();
				} else {
					elem.fadeOut();
				}
			});

			elem.bind('click', function() {
				angular.element('body').animate({
			    	scrollTop: 0
				},500);
			});	
		}
	};
});

vroomApp.directive('ageAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			
			elem.dropdown({
				onChange: function(val) {
					scope.$apply(function() {
						scope.ageScope = val;
					});
				}
			});
			scope.$watch(scope.ageScope, function(oldValue, newValue) {
				elem.dropdown('set selected', newValue);
			});
		}
	};
});

vroomApp.directive('countryAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.dropdown({
				onChange: function(val) {
					scope.$apply(function() {
						scope.countryScope = val;						
					});
				}
			});

			scope.$watch(scope.countryScope, function(oldValue, newValue) {
				elem.dropdown('set selected', scope.countryScope);							
				scope.countryNameScope = elem.dropdown('get text');
			});

		}
	};
});

vroomApp.directive('checkoutAttention', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.mouseenter(function() {
				$(this).find('.btn-confirm').addClass('animated pulse');
			});

			elem.mouseleave(function() {
				$(this).find('.btn-confirm').removeClass('animated pulse');
			});
		}
	};
});

vroomApp.directive('gridCarAttention', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.mouseenter(function() {		
				if(!$(this).hasClass("animated pulse")) {

					if(!$(this).hasClass('selected')) {
						$(this).find('.btn-checkout').addClass('animated pulse');				
					}
				}
			});

			elem.mouseleave(function() {
				$(this).find('.btn-checkout').removeClass('animated pulse');
			});
		}
	}
});

vroomApp.directive('confirmAction', function($http) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {

				angular.element(scope.book_dimmer).dimmer({
					closable: false	
				});
				angular.element(scope.book_dimmer).dimmer('show');
				
				var book_information = new Array();
				var vehicle = new Array();

				book_information['vehicle'] = vehicle;

				$http.get('trybooking').success(function(data, status, headers, config) {
					angular.element(scope.book_dimmer).dimmer('hide');
					window.location = 'thanks';
				}).error(function(data, status, headers, config) {
					angular.element(scope.book_dimmer).dimmer('hide');
					alert(data.result);
				});
			});
		}
	};
});

vroomApp.directive('openCheckoutAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			
			var myEvent;
			var toDoHoverOut;

			elem.closest('.car').find('.checkout').slideUp();

			elem.hover(function() {
				/* on mouse over */
				
				/*elem.popup('show');*/
				toDoHoverOut = true;
				elem.removeClass('animated pulse');
				myEvent = setTimeout(function() {					
					elem.closest('.car').find('.checkout').find('.action').hide();
					elem.closest('.car').find('.checkout').find('.two.column.grid').addClass('midheight');
					elem.closest('.car').find('.checkout').slideDown(function() {
						elem.closest('.car').find('.checkout').find('.action').show();
					});
					myEvent = null;
				}, 300);
				

			}, function() {
				/* on mouse out */
				elem.addClass('animated pulse');
				if(myEvent != null) {
					clearTimeout(myEvent);
				} else {
					myEvent = null;

					if(toDoHoverOut) {						
						elem.closest('.car').find('.checkout').find('.action').hide();
						elem.closest('.car').find('.checkout').slideUp(400, function() {
							elem.closest('.car').find('.checkout').find('.action').show();
							elem.closest('.car').find('.checkout').find('.two.column.grid').removeClass('midheight');
						});
					}
				}				
			});

			elem.bind('click', function() {	
				
				var to_view;

				to_view = true;

				if(elem.hasClass('disabled')) {
					return false;
				}

				clearTimeout(myEvent);
				toDoHoverOut = false;
				elem.closest('.car').find('.checkout').find('.two.column.grid').removeClass('midheight');				
				elem.closest('.cars').find('.car').find('.checkout').find('.action').hide();
				elem.closest('.cars').find('.car').removeClass('disabled');
				elem.closest('.cars').find('.car').removeClass('selected');
				elem.closest('.car').find('.btn-checkout').removeClass('animated pulse');
				
				$.each(elem.closest('.cars').find('.car').find('.checkout'), function(i, cElement) {
					if(!$(this).is(':hidden')) {
						to_view = false;

						$(this).closest('.car').find('.btn-checkout').removeClass('disabled');

						$(this).slideUp(400, function() {
							angular.element('body').animate({
						    	scrollTop: (elem.closest('.car').position().top)
							},500, function() {
								elem.addClass('disabled');
								elem.closest('.car').addClass('selected');
								elem.closest('.car').find('.checkout').find('.action').show();
								elem.closest('.car').find('.checkout').slideDown();
							});	
						});
					}
				});
				
				if(to_view) {
					angular.element('body').animate({
				    	scrollTop: (elem.closest('.car').position().top)
					},500, function() {					
						elem.closest('.car').addClass('selected');
						elem.addClass('disabled');
						elem.closest('.car').find('.checkout').find('.action').show();
						elem.closest('.car').find('.checkout').slideDown();
					});	
				}
			});			
		}
	};
});

vroomApp.directive('cancelCheckoutAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.bind('click', function() {
				elem.closest('.action').hide();
				elem.closest('.car').find('.btn-checkout').removeClass('disabled');
				elem.closest('.car').find('.btn-checkout').addClass('animated pulse');
				elem.closest('.car').removeClass('selected');
				elem.closest('.checkout').slideUp();
			});
		}
	};
});

vroomApp.directive('searchCarAction', function($http, $compile) {
	return {
		restrict: 'A',		
		link: function($scope, elem, attrs) {
			
			elem.click(function() {
				var inp_search = $('#inp-search').val();
				var loc_id;

				if(inp_search == '') {
					return false;
				}
				
				angular.element(attrs.dimmer).dimmer('show');

				$scope.get_results();
			});
		}
	};
});




vroomApp.directive('tabItemAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {								
				if(!$(this).hasClass('active')) {
					var search_id = $(this).attr('search_id');

					elem.parent().find('.item').removeClass('active');
					$('.result.column').hide();
					$('.result.column.s-' + search_id).fadeIn();

					scope.$apply(function() {
						scope.current_selected_search = search_id;
					});

					$(this).addClass('active');	
					var pickup_date = $(this).attr('pickup_date');
					var pickup_time = $(this).attr('pickup_time');
					var return_date = $(this).attr('return_date');
					var return_time = $(this).attr('return_time');
					var country_code = $(this).attr('citizen_country');
					var age = $(this).attr('age');
					var pickup_loc_id = $(this).attr('pickup_place');
					var return_loc_id = $(this).attr('return_place');

					window.history.pushState({}, "New Param", "results?pDate=" + pickup_date + "&pTime=" + pickup_time + "&rDate=" + return_date + "&rTime=" + return_time+ "&cCountryID=" + country_code + "&age=" + age + "&pLocID=" + pickup_loc_id + "&rLocID=" + return_loc_id);
				}	
			});
		}
	};
});



vroomApp.directive('currentAddressAction', function($http) {
	return {
		link: function(scope, elem, attrs) {
			
			elem.keyup(function(e) {
				var obj_autocomplete = $(this).next();
				if(e.keyCode == 38 || e.keyCode == 40) {
					if(obj_autocomplete.is(':visible')) {
						scope.$apply(function() {
							if(e.keyCode == 38) {
								
								if((scope.autocomplete_index-1) < 0) {
									scope.autocomplete_index = (scope.addresses.length-1);
								} else {
									scope.autocomplete_index--;
								}
							} else if(e.keyCode == 40) {
								if((scope.autocomplete_index+1) > (scope.addresses.length-1)) {
									scope.autocomplete_index = 0;
								} else {
									scope.autocomplete_index++;
								}
								
							}		
						});	
					}
				} else if(e.keyCode == 13) {
					scope.address_autocomplete_action(obj_autocomplete.find('td.active'));
				} else if(e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 192 || e.keyCode == 8 || e.keyCode == 186 || e.keyCode == 189 || e.keyCode == 187 || e.keyCode == 222 || e.keyCode == 188 || e.keyCode == 190) {
					var interval = 1000;
					clearTimeout(scope.placesAutocompleteTimeout);

					if(elem.val() != '') {

						scope.placesAutocompleteTimeout = setTimeout(function() {
							var autocompleteService = new google.maps.places.AutocompleteService();
							autocompleteService.getPlacePredictions({ input: elem.val() }, function(predictions, status) {
													
								scope.$apply(function() {
									if(attrs.source == 'modal') {
										scope.addresses = [];	
									} else {
										scope.$parent.$parent.addresses = [];	
									}
								});

								if(status == google.maps.places.PlacesServiceStatus.OK) {
									angular.forEach(predictions, function(row, ind) {								
										var placeDetailsService = new google.maps.places.PlacesService(scope.mapInstance);
										placeDetailsService.getDetails({
											placeId: row.place_id
										}, function(place, status2) {

											if(status2 == 'OK') {
												scope.$apply(function() {
													if(attrs.source == 'modal') {
														scope.addresses.push({
															address: row.description,
															place_id: row.place_id,
															lat: place.geometry.location.k,
															lon: place.geometry.location.B
														});	
													} else {
														scope.$parent.$parent.addresses.push({
															address: row.description,
															place_id: row.place_id,
															lat: place.geometry.location.k,
															lon: place.geometry.location.B
														});
													}
													

												});
												
												obj_autocomplete.show();
												elem.parent().find('.loading').hide();
											} else {
												obj_autocomplete.hide();
												return;
											}
										});
									});
								} else {
									obj_autocomplete.hide();
								}
							});
						},300);						
					} else {
				    	elem.attr('lat', '');
				    	elem.attr('lon', '');
				    	elem.closest('.ui.form').find('.button').addClass('disabled');
				    	obj_autocomplete.hide();				    	
				    	if(attrs.source == 'modal') {
				    		scope.addresses = [];	
				    	} else {
				    		scope.$parent.$parent.addresses = [];	
				    	}
				    }
				}
				

				/*var obj_autocomplete = $(this).next();

				if(e.keyCode == 38 || e.keyCode == 40) {
					if(obj_autocomplete.is(':visible')) {

						scope.$apply(function() {
							if(e.keyCode == 38) {
								
								if((scope.autocomplete_index-1) < 0) {
									scope.autocomplete_index = (scope.addresses.length-1);
								} else {
									scope.autocomplete_index--;
								}
							} else if(e.keyCode == 40) {
								if((scope.autocomplete_index+1) > (scope.addresses.length-1)) {
									scope.autocomplete_index = 0;
								} else {
									scope.autocomplete_index++;
								}
								
							}		
						});	
					}
				} else if(e.keyCode == 13) {
					scope.address_autocomplete_action(obj_autocomplete.find('td.active'));
				} else if(e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 192 || e.keyCode == 8 || e.keyCode == 186 || e.keyCode == 189 || e.keyCode == 187 || e.keyCode == 222 || e.keyCode == 188 || e.keyCode == 190) {
					var interval = 1000;
					clearTimeout(scope.placesAutocompleteTimeout);

					if(elem.val() != '') {
						scope.$apply(function() {
							scope.placesAutocompleteTimeout = setTimeout(function() {
								var pickup_city = $('.tabular.res.menu').find('.active.item').attr('pickup_city');
								var pickup_country_name = $('.tabular.res.menu').find('.active.item').attr('pickup_country_name');

								elem.parent().find('.loading').show();

								var autocomplete = new google.maps.places.Autocomplete(elem);
					        	$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +  elem.val() + ' ' +  pickup_city + ' ' + pickup_country_name +  '&key=AIzaSyDDEDYiOI7-uFsbP8bgvzlkP4aRTF21Tqw')
								$http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' +  elem.val() + '&key=AIzaSyDDEDYiOI7-uFsbP8bgvzlkP4aRTF21Tqw')
								.success(function(data, status, headers, config) {
									if(data.status == 'OK') {									
										scope.addresses = [];
											
										angular.forEach(data.predictions, function(row, index) {
											scope.addresses.push({
												address: row.description,
												place_id: row.place_id,
												lat: '',
												lon: ''
											});
										});	
										obj_autocomplete.show();
										elem.parent().find('.loading').hide();
									} else {
										obj_autocomplete.hide();
									}

								});



								$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +  elem.val() + '&key=AIzaSyDDEDYiOI7-uFsbP8bgvzlkP4aRTF21Tqw')
								.success(function(data, status, headers, config) {
									if(data.status == 'OK') {									
										scope.addresses = [];
											
										angular.forEach(data.results, function(row, index) {
											scope.addresses.push({
												address: row.formatted_address,
												lat: row.geometry.location.lat,
												lon: row.geometry.location.lng
											});
										});	
										obj_autocomplete.show();
										elem.parent().find('.loading').hide();
									} else {
										obj_autocomplete.hide();
									}

								});
					        }, 300);
						});								       
				    } else {
				    	elem.attr('lat', '');
				    	elem.attr('lon', '');
				    	elem.closest('.ui.form').find('.button').addClass('disabled');
				    	obj_autocomplete.hide();
				    	scope.addresses = [];
				    }
				}*/
			});

			elem.blur(function() {
				/*var obj_autocomplete = $(this).next();
				obj_autocomplete.hide();
				scope.$apply(function() {
					scope.autocomplete_index = 0;
				});*/
			});
		}
	};	
});


vroomApp.directive('placesAction', function($http) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.bind('keyup', function(e) {
				var obj_autocomplete = $(this).next();
				if(e.keyCode == 38 || e.keyCode == 40) {
					if(obj_autocomplete.is(':visible')) {

						scope.$apply(function() {
							if(e.keyCode == 38) {
								/* up */
								if((scope.autocomplete_index-1) < 0) {
									scope.autocomplete_index = (scope.places.length-1);
								} else {
									scope.autocomplete_index--;
								}
							} else if(e.keyCode == 40) {
								/* down */
								if((scope.autocomplete_index+1) > (scope.places.length-1)) {
									scope.autocomplete_index = 0;
								} else {
									scope.autocomplete_index++;
								}
								
							}		
						});	
					}
				} else if(e.keyCode == 13) {
					scope.autocomplete_action(obj_autocomplete.find('td.active'));
				} else if(e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 192 || e.keyCode == 8 || e.keyCode == 186 || e.keyCode == 189 || e.keyCode == 187 || e.keyCode == 222 || e.keyCode == 188 || e.keyCode == 190) {
					if(obj_autocomplete.children().children().length == 0) {
						obj_autocomplete.hide();
					}
					clearTimeout(scope.placesAutocompleteTimeout);

				    if(elem.val() != '') {

	 			    	scope.$apply(function() {
				    		scope.placesAutocompleteTimeout = setTimeout(function() {
					        	$http.get('places/10/' +  elem.val())
									.success(function(data, status, headers, config) {
										if(data.length != 0) {

											scope.places = [];												
											angular.forEach(data, function(value, index) {
												scope.places.push(value);
											});	
																				
											obj_autocomplete.show();
										} else {
											obj_autocomplete.hide();
										}
									});
					        }, 300);	
				    	});
				        
				    } else {
				    	obj_autocomplete.hide();
				    	scope.places = [];
				    }
				}
			});

			elem.blur(function() {
				/*var obj_autocomplete = $(this).next();
				obj_autocomplete.hide();
				scope.$apply(function() {
					scope.autocomplete_index = 0;
				});*/
			});
		}
	};
});

vroomApp.directive('pickupDateFocusAction', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.focus(function() {				
				if(!$('.pdate').popup('is visible')) {
					$('.pdate').popup('show', show_picker);
				} else {
					if($('.ui.popup').hasClass('returnDate')) {
						$('.pdate').popup('hide', function() {
							$('.pdate').popup('show', show_picker);					
						});
					}
				}
			});

			function show_picker() {

				$('.date-header').html('What pickup date?');
				$('.time-header').html('What pickup time?');

				var pickupDate;
				var tElementHTML = ' \
						<div class="timepicker"> \
							<input type="text" class="timepickerE" style-timepicker/> \
						</div> \
						<div class="ui small green button setter date" setter-pickup-date-action>Next</div>';

				var tElement = $(tElementHTML);
				$('.datepick').closest('.ui.popup').find('.content').append(tElement);
				$compile(tElement)(scope);
					
				$('.date-header').addClass('animated pulse');
				$('.date-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$(this).removeClass('animated pulse');
				});

				if(scope.pickupDateScope == '') {
					pickupDate = current_date;
				} else {
					pickupDate = new Date(scope.pickupDateScope);
				}

				$('.datepick').datepick({ 
					rangeSelect: true, 
					defaultDate: pickupDate,
					selectDefaultDate: true,
					minDate: '+0',
					monthsOffset: 0,
					changeMonth: false,
					monthsToShow: 1,
					nextText: 'Next',
					todayText: '',
					prevText: 'Prev',
					onSelect: function(dates) {									
						
						var tmp_from_date = dates[0];
						var arr_tmp_from_date = tmp_from_date.toISOString().split("T");
						
						$('.datepick').datepick('setDate', tmp_from_date);
						$('.time-header').addClass('animated pulse');
						$('.time-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
							$(this).removeClass('animated pulse');
						});
					}
				});

				$('.datepick').closest('.ui.popup').addClass(attrs.id);
			};
		}
	};
});

vroomApp.directive('returnDateFocusAction', function($compile) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.focus(function() {				
				if(!$('.pdate').popup('is visible')) {
					$('.pdate').popup('show', show_picker);
				} else {
					$('.pdate').popup('hide', function() {
						$('.pdate').popup('show', show_picker);
					});					
				}
			});

			function show_picker() {
				$('.date-header').html('What return date?');
				$('.time-header').html('What return time?');
				$('.datepick').closest('.ui.popup').removeClass("pickupDate returnDate");
				$('.datepick').closest('.ui.popup').addClass('returnDate');					

				var pickupDateVal,
					returnDateVal;

				var tElementHTML = ' \
						<div class="timepicker"> \
							<input type="text" class="timepickerE" style-timepicker/> \
						</div> \
						<div class="ui small green button setter date" setter-return-date-action>Next</div>';

				var tElement = $(tElementHTML);
				$('.datepick').closest('.ui.popup').find('.content').append(tElement);						
				$compile(tElement)(scope);

				if(scope.pickupDateScope != '') {
					pickupDateVal = new Date(scope.pickupDateScope);
				}

				if(scope.returnDateScope != '') {
					returnDateVal = new Date(scope.returnDateScope);
				}

				

				$('.date-header').addClass('animated pulse');
				$('.date-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$(this).removeClass('animated pulse');
				});	

				$('.datepick').datepick({ 
					rangeSelect: true, 
					defaultDate: pickupDateVal,
					selectDefaultDate: true,
					minDate: pickupDateVal,
					monthsOffset: 0,
					changeMonth: false,
					monthsToShow: 1,
					nextText: 'Next',
					todayText: '',
					prevText: 'Prev',
					onSelect: function(dates) {									
						
						var tmp_to_date = dates[1];

						if(scope.pickupDateModel == '') {
							$('#pickupDate').focus();
						} else {

							var arr_tmp_to_date = tmp_to_date.toISOString().split("T");

							/*$('#returnDate').attr('nval', arr_tmp_to_date[0]);*/
							$('.datepick').datepick('setDate', new Date(scope.pickupDateScope), new Date(tmp_to_date));
							$('.time-header').addClass('animated pulse');
							$('.time-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
								$(this).removeClass('animated pulse');
							});
						} 										
					}
				});
				
				$('.datepick').closest('.ui.popup').addClass(attrs.id);				
			}
		}
	};
});

vroomApp.directive('styleTimepicker', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {			
			
			elem.scroller({
            	theme: 'ios7',
            	animate: '',
            	lang: '',
            	height: 25,
            	preset: 'time',
            	mode: 'mixed',
            	display: 'inline',
            	onChange: function() {            		
            		$('.ui.setter.date').addClass('animated pulse');
            		$('.ui.setter.date').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
						$(this).removeClass('animated pulse');
					});
            	}
            });

            elem.scroller('setValue', '10:00');

		}
	};
})

vroomApp.directive('setterPickupDateAction', function(helpers) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				var pickupDate = $(".datepick").datepick('getDate');
				var tvalue = $('.timepickerE').scroller('getDate');
				
				pickupDate = pickupDate[0];
				
				scope.$apply(function() {
					scope.pickupDateScope = helpers.extract_time_from_isostring(pickupDate.toISOString());
					scope.pickupTimeScope = helpers.split_time_with_timezone(tvalue);
					var obj_time = helpers.disect_time(helpers.split_time_to_object(scope.pickupTimeScope));
					scope.pickupDateModel = month[pickupDate.getMonth()] + ' ' + pickupDate.getDate() + ' ' + obj_time.hour + ":" + obj_time.minute + " " + obj_time.suffix;
				});

				$('.pdate').popup('hide', function() {
					$('#returnDate').focus();					
				});	
			});
		}
	};
});


vroomApp.directive('setterReturnDateAction', function(helpers) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {

				if(scope.pickupDateModel == '') {
					$('#pickupDate').focus();
					return false;
				}

				var datepick_date = $(".datepick").datepick('getDate');
				var returnDate;
				var tvalue = $('.timepickerE').scroller('getDate');
				var h,m,suff;

				returnDate = datepick_date[1];
							
				scope.$apply(function() {
					scope.returnDateScope = helpers.extract_time_from_isostring(returnDate.toISOString());
					scope.returnTimeScope = helpers.split_time_with_timezone(tvalue);
					var obj_time = helpers.disect_time(helpers.split_time_to_object(scope.returnTimeScope));
					scope.returnDateModel = month[returnDate.getMonth()] + ' ' + returnDate.getDate() + ' ' + obj_time.hour + ":" + obj_time.minute + " " + obj_time.suffix;
				});

				$('.pdate').popup('hide');				
			});
		}
	};
});

vroomApp.directive('autocompleteFieldAction', function() {
	return {
		restrict: 'A',		
		link: function(scope, elem, attrs) {
			elem.children().bind('click', function() {				
				var loc_id = $(this).attr('id');
				var place_text = $(this).html();
				
				scope.$apply(function() {
					scope.pickupIdScope = loc_id;
					scope.returnIdScope = loc_id;
					scope.pickupScope = place_text;
				});		

				elem.closest('table').hide(400, function() {
					$('#pickupDate').focus();
				});
			}) 
		}
	}
});

vroomApp.directive('filterAirconAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},		
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				
				elem.toggleClass('active');

				scope.$apply(function() {
					if(elem.hasClass('active')) {
						// show only 
						scope.arrfilters.aircon.value = true;
					} else {
						scope.arrfilters.aircon.value = '';
					}	
				});
			});			
		}
	};
});

vroomApp.directive('filterAirportAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},		
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				
				elem.toggleClass('active');

				scope.$apply(function() {
					if(elem.hasClass('active')) {						
						scope.arrfilters.airport.value = true;
					} else {
						scope.arrfilters.airport.value = '';
					}	
				});
			});			
		}
	};
});

vroomApp.directive('filterDistanceAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},		
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				
				elem.toggleClass('active');

				scope.$apply(function() {
					if(elem.hasClass('active')) {						
						scope.arrfilters.aircon.value = true;
					} else {
						scope.arrfilters.aircon.value = '';
					}	
				});
			});			
		}
	};
});

vroomApp.directive('filterClassAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},
		link: function(scope, elem, attrs) {
									
			elem.checkbox({
				onEnable: function(x) {
					var checkbox = $(this);

					scope.$apply(function() {
						if(checkbox.length > 0) {
							scope.arrfilters.class.value.push(checkbox.attr('data-value'));
						}
					});					
				},
				onDisable: function() {
					var checkbox = $(this);

					$.each(scope.arrfilters.class.value, function(index, val) {
						if(val == checkbox.attr('data-value')) {
							scope.$apply(function() {
								scope.arrfilters.class.value.splice(index, 1);
							});
						}
					});
				}
			});			
		}
	};
});

vroomApp.directive('filterCategoryAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},
		link: function(scope, elem, attrs) {
									
			elem.checkbox({
				onEnable: function(x) {
					var checkbox = $(this);

					scope.$apply(function() {
						if(checkbox.length > 0) {
							scope.arrfilters.category.value.push(checkbox.attr('data-value'));
						}
					});					
				},
				onDisable: function() {
					var checkbox = $(this);

					$.each(scope.arrfilters.category.value, function(index, val) {
						if(val == checkbox.attr('data-value')) {
							scope.$apply(function() {
								scope.arrfilters.category.value.splice(index, 1);
							});
						}
					});
				}
			});			
		}
	};
});

vroomApp.directive('filterSupplierAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},
		link: function(scope, elem, attrs) {
									
			elem.checkbox({
				onEnable: function(x) {
					var checkbox = $(this);

					scope.$apply(function() {
						if(checkbox.length > 0) {
							scope.arrfilters.supplier.value.push(checkbox.attr('data-value'));
						}
					});					
				},
				onDisable: function() {
					var checkbox = $(this);

					$.each(scope.arrfilters.supplier.value, function(index, val) {
						if(val == checkbox.attr('data-value')) {
							scope.$apply(function() {
								scope.arrfilters.supplier.value.splice(index, 1);
							});
						}
					});
				}
			});			
		}
	};
});

/*vroomApp.directive('filterSupplierAction', function() {
	return {
		restrict: 'A',
		scope: {
			arrfilters: '='
		},
		link: function(scope, elem, attrs) {
									
			elem.find('.checkbox').checkbox({
				onEnable: function(x) {
					var checkbox = $(this);

					scope.$apply(function() {
						scope.arrfilters.supplier.value.push(checkbox.attr('data-value'));
					});					
				},
				onDisable: function() {
					var checkbox = $(this);

					$.each(scope.arrfilters.supplier.value, function(index, val) {
						if(val == checkbox.attr('data-value')) {
							scope.$apply(function() {
								scope.arrfilters.supplier.value.splice(index, 1);
							});
						}
					});
				}
			});			
		}
	};
});*/

vroomApp.directive('removeFavoriteAction', function() {
	return {
		restrict: 'A',
		scope: {
			vehicles: '=',
			cfavorites: '='
		},
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				var car_id = elem.closest('.item').attr('id').replace('favorite-', '');
				
				angular.element('#' + car_id).find('.favorites').removeClass('active');	

				angular.forEach(scope.cfavorites, function(row, index) {
					if(row.id == car_id) {						
						scope.$apply(function() {							
							scope.cfavorites.splice(index, 1);	
						});
						window.localStorage.setItem('car_favorites', JSON.stringify(scope.cfavorites));
					}
				});			
			});
		}
	};
});

vroomApp.directive('removeSearchFavoriteAction', function() {
	return {
		restrict: 'A',		
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {
				var id = elem.parent().attr('id').replace('favorite-', '');								

				angular.forEach(scope.search_favorites, function(row, index) {
					if(row.id == id) {						
						scope.$apply(function() {							
							scope.search_favorites.splice(index, 1);	
						});

						$.each($('.tabular.res').find('.item'), function() {
							if($(this).attr('id').replace('search-', '') == id) {
								$(this).find('.corner.label').removeClass('active');
							}
						});						
						window.localStorage.setItem('search_favorites', JSON.stringify(scope.search_favorites));
					}
				});			
			});
		}
	};
});


vroomApp.directive('searchFavoriteAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.click(function() {
				var search_item;

				search_item = elem.parent();
				var id = search_item.attr('id').replace('search-', '');

				if(!elem.hasClass('active')) {
					scope.$apply(function() {													
						scope.search_favorites.push({
							id: id,
							datetime_text: search_item.attr('datetime_text'),
							pickup_date: search_item.attr('pickup_date'),
							pickup_time: search_item.attr('pickup_time'),
							return_date: search_item.attr('return_date'),
							return_time: search_item.attr('return_time'),
							search_id: search_item.attr('search_id'),
							pickup_place_name: search_item.attr('pickup_place_name'),
							pickup_place: search_item.attr('pickup_place'),
							return_place: search_item.attr('return_place'),
							age: search_item.attr('age'),
							citizen_country: search_item.attr('citizen_country'),
							citizen_country_name: search_item.attr('citizen_country_name')
						});	
					});

					window.localStorage.setItem('search_favorites', JSON.stringify(scope.search_favorites));					
					elem.addClass('active');
				} else {

					angular.forEach(scope.search_favorites, function(row, index) {
						if(row.id == id) {
							scope.$apply(function() {
								scope.search_favorites.splice(index, 1);
							});							
							window.localStorage.setItem('search_favorites', JSON.stringify(scope.search_favorites));
							elem.removeClass('active');
						}
					});	
				}
			});
		}
	};
});

vroomApp.directive('favoritesAction', function() {
	return {
		restrict: 'A',
		scope: {
			cfavorites: '=',
			vehicles: '='
		},
		link: function(scope, elem, attrs) {
			elem.bind('click', function() {

				var car_id = elem.closest('.column.car').attr('id');

				if(!elem.hasClass('active')) {

					scope.$apply(function() {
						angular.forEach(scope.vehicles, function(row, index) {
							if(row.vehicleElemID == car_id) {
								scope.cfavorites.push({
									img_url: angular.element('#' + car_id).find('.image.column').find('img').attr('src'),
									id: car_id,
									price: row.currency + ' ' + row.price,
									name: row.vehicleName
								});	
							}
						});
					});

					window.localStorage.setItem('car_favorites', JSON.stringify(scope.cfavorites));					
				} else {

					angular.forEach(scope.cfavorites, function(row, index) {
						if(row.id == car_id) {
							scope.$apply(function() {
								scope.cfavorites.splice(index, 1);	
							});
							window.localStorage.setItem('car_favorites', JSON.stringify(scope.cfavorites));
						}
					});					
				}				
			});
		}
	};
});

vroomApp.directive('filterTransmissionAction', function() {
	return {
		restrict: 'A', 
		scope: {
			arrfilters: '='
		},
		link: function(scope, elem, attrs) {

			elem.bind('click', function() {
				elem.toggleClass('active');				

				scope.$apply(function() {
					if(elem.hasClass('active')) {
						// show only 						
						scope.arrfilters.transmission.value = elem.attr('value');
					} else {
						scope.arrfilters.transmission.value = '';
					}	
				});
			});		
		}
	};
});