(function() {
	var resultsDirective = angular.module('results-directive', []);

	resultsDirective.directive('sidebarAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.sidebar();
				elem.sidebar('show');
			}
		};
	});

	/*resultsDirective.directive('pageHeaderAction', ['HeaderService', function(headerService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('pageHeader', function(newVal, oldVal) {					
					if(newVal != oldVal) {						
						elem.html(newVal);
					}
				});

				headerService.getHeader(attrs.pageHeaderAction).then(function(data) {										
					scope.pageHeader = data.htmlContent;
				});
			}
		};
	}]);

	resultsDirective.directive('pageFooterAction', ['FooterService', function(footerService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('pageFooter', function(newVal, oldVal) {					
					if(newVal != oldVal) {						
						elem.html(newVal);
					}
				});

				footerService.getFooter(attrs.pageFooterAction).then(function(data) {										
					scope.pageFooter = data.htmlContent;
				});
			}
		};
	}]);*/

	resultsDirective.directive('pickupLocationAction', ['locationService', '$timeout', function(locService, timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var promiseTimeout;

				scope.$watch('pickupLocation', function(newVal, oldVal) {
					if(newVal.value != '' && newVal.id != '') {
						if(scope.isSameLocation.value) {
							scope.returnLocation.id = scope.pickupLocation.id;
							scope.returnLocation.value = scope.pickupLocation.value;
						}
					}
				}, true);

				elem.keyup(function(e) {
					var pickupLocationText = elem.val();
					scope.pickupLocation.id = '';
					if(!scope.$$phase) {
						scope.$apply();
					}

					if((e.keyCode < 37 || e.keyCode > 40)) {
					
						if(e.keyCode != 13) {
							if(pickupLocationText == '') {
								scope.pickupLocations = [];
								scope.$apply();
							} else {
								
								/*scope.$apply();*/
								timeout.cancel(promiseTimeout);
								promiseTimeout = timeout(function() {
									scope.pickupLocationQuerying = true;
									locService.getLocations(pickupLocationText).then(function(locations) {
										scope.pickupLocations = locations;
										scope.pickupLocationQuerying = false;
										elem.next().show();
									});
								}, 500);						
							}
						}						
					}									
				});
			}		
		};
	}]);

	resultsDirective.directive('returnLocationAction', ['locationService', '$timeout', function(locService, timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var promiseTimeout;

				elem.keyup(function(e) {
					var returnLocationText = elem.val();
					scope.returnLocation.id = '';
					scope.isSameLocation.value = false;

					if(!scope.$$phase) {
						scope.$apply();
					}

					/*scope.$watch('pickupLocation', function(newVal, oldVal) {
						if(newVal != oldVal) {
							
						}
					});*/

					if((e.keyCode < 37 || e.keyCode > 40)) {
					
						if(e.keyCode != 13) {
							if(returnLocationText == '') {
								scope.returnLocations = [];
								scope.$apply();
							} else {
								
								/*scope.$apply();*/
								timeout.cancel(promiseTimeout);
								promiseTimeout = timeout(function() {
									scope.returnLocationQuerying = true;
									locService.getLocations(returnLocationText).then(function(locations) {
										scope.returnLocations = locations;
										scope.returnLocationQuerying = false;
										elem.next().show();
									});
								}, 500);						
							}
						}						
					}									
				});
			}		
		};
	}]);

	resultsDirective.directive('sameReturnLocationAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.checkbox({
					onEnable: function() {
						scope.returnLocation.id = scope.pickupLocation.id;
						scope.returnLocation.value = scope.pickupLocation.value;
						scope.isSameLocation.value = true;

						if(!scope.$$phase) {
							scope.$apply();	
						}
						/*scope.$apply();*/
					},
					onDisable: function() {
						scope.isSameLocation.value = false;
						/*scope.$apply();*/

						if(!scope.$$phase) {
							scope.$apply();	
						}
					}
				});

				scope.$watch('isSameLocation.value', function(newVal, oldVal) {
					if(newVal) {
						elem.checkbox('enable');
					} else {
						elem.checkbox('disable');	
					}				
				});
			}
		};
	});

	resultsDirective.directive('dateFieldAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('editPickupDate', function(newVal, oldVal) {					
					if(newVal) {
						elem.fadeIn(400, function() {
							elem.find('input').trigger('focus');
							elem.find('input').trigger('click');
						});
					}					
				});
			}
		};
	});

	resultsDirective.directive('datepickerAction', ['$compile', function(compile) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var html;
				var fieldType;

				fieldType = attrs.fieldType;

				if(fieldType == 'pickup') {
					/*scope.$watch('pickupDate', function(newVal, oldVal) {
						if(newVal.date != '') {							
							if(elem.popup('exists')) {
								elem.popup('hide', function() {
									scope.editReturnDate = true;

									if(!scope.$$phase) {
									  scope.$apply();
									}
									
								});
							}
						}
					}, true);*/

					$(document).click(function(e) { 					
						if(!$(e.target).closest('.popup').length) {
							if(!$(e.target).closest('.datepick').length) {
								if(!$(e.target).hasClass('autocomplete-node')) {
									if(!$(e.target).closest('.autocomplete-node').length) {
										if(elem.popup('is visible')) {
											scope.editPickupDate = false;
											scope.$apply();
										}
									}
								}
							}
						}
					});


					scope.$watch('editPickupDate', function(newVal, oldVal) {
						if(newVal != oldVal) {
							if(newVal == false) {
								if(elem.popup('exists')) {
									elem.popup('hide', function() {
										scope.editReturnDate = true;

										if(!scope.$$phase) {
										  scope.$apply();
										}
										
									});
									elem.trigger('blur');
								}
							} else {
								if(!elem.popup('is visible')) {
									elem.popup('show');
									elem.trigger('focus');
								}
							}
						}
					});

					elem.click(function(e) {
						e.stopImmediatePropagation();
						scope.editReturnDate = false;
						scope.editPickupDate = true;
						if(!scope.$$phase) {
							scope.$apply();
						}
					});
				} else if(fieldType == 'return') {
					/*scope.$watch('returnDate', function(newVal, oldVal) {
						if(newVal.date != '') {
							if(elem.popup('exists')) {
								elem.popup('hide');
							}
						}
					}, true);*/
				

					$(document).click(function(e) { 					
						if(!$(e.target).closest('.popup').length) {
							if(!$(e.target).closest('.datepick').length) {
								if(!$(e.target).hasClass('autocomplete-node')) {
									if(!$(e.target).closest('.autocomplete-node').length) {
										if(elem.popup('is visible')) {
											scope.editReturnDate = false;
											scope.$apply();
										}
									}
								}
							}
						}
					});

					scope.$watch('editReturnDate', function(newVal, oldVal) {
						if(newVal == false) {
							if(elem.popup('exists')) {
								elem.popup('hide');
								elem.trigger('blur');
							}
						} else {
							if(!elem.popup('is visible')) {
								elem.popup('show');
								elem.trigger('focus');
							}
						}
					});

					elem.click(function(e) {
						e.stopImmediatePropagation();
						scope.editReturnDate = true;
						scope.editPickupDate = false;

						if(!scope.$$phase) {
							scope.$apply();
						}						
						/*scope.$apply();*/
					});
				}

				html = ' \
					<div class="ui two column stackable grid"> \
						<div class="equal height row"> \
							<div class="column"> \
								<h4 class="ui dividing header">';

				if(fieldType == 'pickup') {
					html += 'What pickup date?';
				} else if(fieldType == 'return') {
					html += 'What return date?';
				}
				html += ' \
								</h4> \
								<span class="datepicker"></span> \
							</div> \
							<div class="column"> \
								<h4 class="ui dividing header">';

				if(fieldType == 'pickup') {
							html += 'What pickup time?';
				} else if(fieldType == 'return') {
							html += 'What return time?';
				}

				html += ' \
								</h4> \
								<div class="wrapper timepicker"> \
								</div> \
							</div> \
						</div> \
					</div> \
					<div class="ui clearing divider"></div> \
					<div class="ui two column action stackable grid"> \
						<div class="column">';

				if(fieldType == 'pickup') {
					html += '<div class="set pickup date ui primary small button" set-pickup-date-action>Set</div>';
				} else if(fieldType == 'return') {
					html += '<div class="set return date ui primary small button" set-return-date-action>Set</div>';
				}

				html += ' \
						</div> \
						<div class="column">';

				if(fieldType == 'pickup') {
					html += '<div class="clear pickup date ui primary small button" close-pickup-date-action>Close</div>';
				} else if(fieldType == 'return') {
					html += '<div class="clear return date ui primary small button" close-return-date-action>Close</div>';
				}

				html += ' \
						</div> \
					</div> \
				';
							
				elem.popup({
					on: 'click',
					inline: true,
					position: 'bottom center',
					content:  html,
					closable: false,
					onHide: function() {
						if(fieldType == 'pickup') {
							scope.editPickupDate = false;
						} else if(fieldType == 'return') {
							scope.editReturnDate = false;
						}
					},
					onShow: function() {
						var inp_timepicker;
						inp_timepicker = $('<input type="text" class="input timepicker" field-type="' + fieldType +'" style-timepicker />');

						elem.next().find('.wrapper.timepicker').append(inp_timepicker);
						compile(elem.next())(scope);


						var datepickerOptions;

						if(fieldType == 'pickup') {
							datepickerOptions = { 
								rangeSelect: false, 
								defaultDate: new Date(scope.pickupDate.date),
								selectDefaultDate: true,
								minDate: '+0',
								monthsOffset: 0,
								changeMonth: false,
								monthsToShow: 1,
								nextText: 'Next',
								todayText: '',
								prevText: 'Prev',
								dateFormat: 'MM DD, yyyy'
							};
						} else if(fieldType == 'return') {
							var minDate = new Date(scope.pickupDate.date);

							datepickerOptions = { 
								rangeSelect: true, 
								defaultDate: new Date(scope.pickupDate.date),
								selectDefaultDate: true,
								minDate: minDate,
								monthsOffset: 0,
								changeMonth: false,
								monthsToShow: 1,
								nextText: 'Next',
								todayText: '',
								prevText: 'Prev',
								dateFormat: 'MM DD, yyyy',
								onSelect: function(dates) {

									var tmp_to_date = dates[1];
									var arr_tmp_to_date = tmp_to_date.toISOString().split("T");
									elem
										.next()
										.find('.datepicker').datepick('setDate', new Date(scope.pickupDate.date), new Date(tmp_to_date));
								}
							};
						}

						elem
							.next()
							.find('.datepicker')
							.datepick(datepickerOptions);

						elem
							.next()
							.find('.datepicker')
							.datepick('setDate', new Date(scope.pickupDate.date + ' ' + scope.pickupDate.time), new Date(scope.returnDate.date + ' ' + scope.returnDate.time));
					}
				});
			}
		};
	}]);

	resultsDirective.directive('closePickupDateAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					scope.editPickupDate = false;
					scope.$apply();
				});
			}
		};
	});

	resultsDirective.directive('closeReturnDateAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					scope.editReturnDate = false;
					scope.$apply();
				});
			}
		};
	});

	resultsDirective.directive('setPickupDateAction', ['DateTimeService', function(dateTimeService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					var datepicker = elem.closest('.content').find('.datepicker');
					var timepicker = elem.closest('.content').find('.input.timepicker');					
					var pickupTime;
					var pickupDate = datepicker.datepick('getDate')[0];
					var tmp_pickupTime = timepicker.scroller('getDate');
					
					pickupDate = dateTimeService.formatDate(pickupDate, 'yyyy-mm-dd');
					pickupTime = dateTimeService.convertToMilitaryTime(tmp_pickupTime);					
										
					scope.pickupDate.date = pickupDate;
					scope.pickupDate.time = pickupTime;
					scope.editPickupDate = false;
					scope.pickupDate.display = dateTimeService.formatDateTimeForDisplay(pickupDate, pickupTime);
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('setReturnDateAction', ['DateTimeService', function(dateTimeService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					var datepicker = elem.closest('.content').find('.datepicker');
					var timepicker = elem.closest('.content').find('.input.timepicker');									
					var returnTime;
					var returnDate = datepicker.datepick('getDate')[1];
					var tmp_returnTime = timepicker.scroller('getDate');
					
					returnDate = dateTimeService.formatDate(returnDate, 'yyyy-mm-dd');
					returnTime = dateTimeService.convertToMilitaryTime(tmp_returnTime);					
										
					scope.returnDate.date = returnDate;
					scope.returnDate.time = returnTime;
					scope.editReturnDate = false;
					scope.returnDate.display = dateTimeService.formatDateTimeForDisplay(returnDate, returnTime);
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('userLocationAction', ['TabsService', '$timeout', 'MapsService', 'ResultsDistanceUnitService', function(tabsService, timeout, mapsService, resultsDistanceUnitService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var promiseTimeout;
							
				scope.$watch('tabs[selectedIndex].userLocation.location.id', function(newVal, oldVal) {
					if(newVal != oldVal) {

						if(newVal != '') {
							var placeDetailsService = new google.maps.places.PlacesService(mapsService.getMap());
							var selectedTab = tabsService.getSelectedTab();

							selectedTab.userLocation.location.selected = selectedTab.userLocation.location.value;
							placeDetailsService.getDetails({
								placeId: selectedTab.userLocation.location.id
							}, function(place, status2) {

								if(status2 == 'OK') {
									var distanceUnit = resultsDistanceUnitService.getDistanceUnit();
									var lat = place.geometry.location.k;
									var lng = place.geometry.location.B;
									var min_userDistance = '';
									var max_userDistance = '';
									selectedTab.userLocation.coordinates.lat = lat;
									selectedTab.userLocation.coordinates.lng = lng;

									var origin = new google.maps.LatLng(lat, lng);
														
									angular.forEach(selectedTab.vehicles, function(vehicle, ind) {
										var destination = new google.maps.LatLng(vehicle.depot_information.lat, vehicle.depot_information.lon);
										var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
																	
										
										if(distanceUnit.value == 'km') {
											distance = distance / 1000;
										}
										

										selectedTab.vehicles[ind].userDistance = distance.toFixed(1);
										
										angular.forEach(selectedTab.filters.depot.choices, function(filterDepotObj, filterDepotInd) {
											if(filterDepotObj.id == vehicle.depot_information.depotId) {
												selectedTab.filters.depot.choices[filterDepotInd].userDistance = distance.toFixed(1);
											}
										});

										if(max_userDistance == '') {
											max_userDistance = distance.toFixed(1);
										} else {
											if(distance.toFixed(1) > parseFloat(max_userDistance)) {
												max_userDistance = distance.toFixed(1);
											}
										}

										if(min_userDistance == '') {
											min_userDistance = distance.toFixed(1);	
										} else {
											if(distance.toFixed(1) < parseFloat(min_userDistance)) {
												min_userDistance = distance.toFixed(1);
											}
										}								
									});

									selectedTab.filters.userDistance.max = parseFloat(max_userDistance);
									selectedTab.filters.userDistance.value.min = parseFloat(min_userDistance);
									selectedTab.filters.userDistance.value.max = parseFloat(max_userDistance);
									selectedTab.filters.userDistance.min = parseFloat(min_userDistance);

									/*if(!scope.$$phase) {
										scope.$apply();
									}*/
									scope.$apply();
								}
							});

							/*var origin = new google.maps.LatLng($scope.main_arr[$scope.current_selected_search].lat, $scope.main_arr[$scope.current_selected_search].lon);
							
							angular.forEach($scope.main_arr[$scope.current_selected_search].vehicles, function(veh_row, veh_index) {
								var destination = new google.maps.LatLng(veh_row.depot_information.lat, veh_row.depot_information.lon);
								var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
															
								distance = distance / 1000;
								$scope.main_arr[$scope.current_selected_search].vehicles[veh_index].user_distance = Math.round(distance);
							});*/							
						}
						
					}
				}, true);

				elem.keyup(function(e) {
					var userLocationText = elem.val();
					var selectedTab = tabsService.getSelectedTab();
					if((e.keyCode < 37 || e.keyCode > 40)) {
						if(e.keyCode != 13) {
							if(userLocationText == '') {
								selectedTab.userLocations = [];								
								scope.$apply();									
							} else {
								selectedTab.userLocationQuerying = true;								
								scope.$apply();									

								timeout.cancel(promiseTimeout);

								promiseTimeout = timeout(function() {
									var autocompleteService = new google.maps.places.AutocompleteService();
									
									autocompleteService.getPlacePredictions({ input: userLocationText }, function(predictions, status) {
										
										selectedTab.userLocations = [];				
										if(!scope.$$phase) {
											scope.$apply();
										}

										if(status == google.maps.places.PlacesServiceStatus.OK) {

											angular.forEach(predictions, function(row, ind) {
												var placeDetailsService = new google.maps.places.PlacesService(mapsService.getMap());
												placeDetailsService.getDetails({
													placeId: row.place_id
												}, function(place, status2) {

													if(status2 == 'OK') {

														selectedTab.userLocations.push({
															id: row.place_id,
															display: row.description,
															value: row.description,
															lat: place.geometry.location.k,
															lng: place.geometry.location.B
														});
														selectedTab.userLocationQuerying = false;
														elem.next().show();														
														scope.$apply();														
													}
												});
											});
										} else {
											selectedTab.userLocationQuerying = false;											
											scope.$apply();											
										}
									});
									
								}, 500);
							}
						}						
					}									
				});			
			}
		};
	}]);

	resultsDirective.directive('filterDepotAction', ['ModalsService', 'TabsService', function(modalsService, tabsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {				
				elem.click(function() {
					var selectedIndex = tabsService.getSelectedIndex();
					var depotId = attrs.depotId;
					var lat = attrs.lat;
					var lng = attrs.lng;

					modalsService.updateShowMapModal(false);
				
					$.each($('.checkbox-depot-filter-' + selectedIndex), function() {
						/*if(depotId != $(this).attr('data-id')) {
							$(this).checkbox('disable');
						}*/
						if(lat != $(this).attr('lat') && lng != $(this).attr('lng')) {
							$(this).checkbox('disable');
						}
					});
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('isShowAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch(attrs.isShowAction, function(newVal, oldVal) {
					if(newVal) {
						elem.slideDown();
					} else {
						elem.slideUp();
					}
				});
			}
		};
	});
	resultsDirective.directive('mapModalAction', ['ModalsService', 'MapsService', 'TabsService', '$rootScope', '$compile', function(modalsService, mapsService, tabsService, rootScope, compile) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
								
				scope.$watch('tabs[selectedIndex].userLocation.coordinates', function(newVal, oldVal) {
					if(newVal != oldVal) {
						var selectedTab = tabsService.getSelectedTab();
						var map = mapsService.getMap();
						var mapProperty = mapsService.getMapProperty();
						var coordinate = newVal;
						var mapProfileImage = mapsService.getMapProfileImage();

						if(elem.modal('is active')) {
							var userMarker = mapsService.getUserMarker();

							if(userMarker != null) {
								userMarker.setMap(null);
								mapsService.clearUserMarker();
							}
							
							var addressLatLng = new google.maps.LatLng(coordinate.lat, coordinate.lng);
							var marker = new google.maps.Marker({
							    position: addressLatLng,
							    map: map,
							    /*icon: "http://maps.google.com/mapfiles/ms/icons/green.png",*/
							    icon: mapProfileImage,
							    title: selectedTab.userLocation.location.value
							});

							mapsService.setUserMarker(marker);
							map.setZoom(mapProperty.zoom);
							map.setCenter(addressLatLng); 
						} else {
							var userMarker = mapsService.getUserMarker();

							if(userMarker != null) {
								userMarker.setMap(null);
								mapsService.clearUserMarker();
							}

							var addressLatLng = new google.maps.LatLng(coordinate.lat, coordinate.lng);
							var marker = new google.maps.Marker({
							    position: addressLatLng,
							    map: null,
							    /*icon: "http://maps.google.com/mapfiles/ms/icons/green.png",*/
							    icon: mapProfileImage,
							    title: selectedTab.userLocation.location.value
							});

							mapsService.setUserMarker(marker);
						}
					}
				}, true);

				elem.modal({
					closable: false,
					onVisible: function() {

						var map = mapsService.getMap();
						var mapProperty = mapsService.getMapProperty();
						var mapFlag = mapsService.getFlag();
						var selectedTab = tabsService.getSelectedTab();
						var selectedIndex = tabsService.getSelectedIndex();
						var coordinates;
						var contentString;
						var to_add_coordinate;
						var to_add_supplier;
						var	marker;
						var addressLatLng;
						var infowindow;
						var markers;
						var userMarker = mapsService.getUserMarker();
						
						google.maps.event.trigger(map, 'resize');

						if(userMarker != null) {
							userMarker.setMap(map);
						}

						if(mapFlag.isMapView) {
							/* map view button */	
							scope.depotAddress = 'Map View';

							coordinates = new Array();
							markers = [];
							angular.forEach(selectedTab.vehicles, function(vehicle, ind) {
								if(vehicle.is_shown) {
									var coordinate = {
										lat: vehicle.depot_information.lat,
										lon: vehicle.depot_information.lon,
										suppliers: [{
											name: vehicle.supplierName,
											count: 1,
											min_price: vehicle.price
										}],										
										id: vehicle.depot_information.depotId
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
							
							for(var i = 0; i < coordinates.length; i++) {

								marker = null;
							  	addressLatLng = null;
							  	infowindow = null;

								var addressLatLng = new google.maps.LatLng(coordinates[i].lat, coordinates[i].lon);
								var markerOption = {
								    position: addressLatLng,
								    map: map
								};

								if(coordinates[i].suppliers.length == 1) {
									markerOption.icon = rootScope.baseUrl + '/img/suppliers/icon-' + coordinates[i].suppliers[0].name + '.gif';
								}

								var marker = new google.maps.Marker(markerOption);

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
	      									<td><img src='" + rootScope.baseUrl + "/img/suppliers/icon-" + coordinates[i].suppliers[x].name + ".gif') /></td> \
	      									<td>" + coordinates[i].suppliers[x].count + "</td> \
	      									<td>" + coordinates[i].suppliers[x].min_price + "</td> \
	    								</tr> \
	    							";
	  							}
	  							
	  							contentString += " \
	  								</tbody> \
								</table>";
								
								contentString += " \
									<div class='ui black mini button filter-depot' lat='" + coordinates[i].lat + "' lng='" + coordinates[i].lon + "' filter-depot-action depot-id='" + coordinates[i].lng + "' id='filter-depot-button-" + selectedIndex + "-" + coordinates[i].id + "'> \
										Filter using this depot \
									</div> \
								";

								var infowindow = new google.maps.InfoWindow();
								/*var compiled = compile(contentString)(scope);*/
								
								infowindow.setContent(contentString);
								/*infowindow.setContent($("<div />").append(compiled.clone()).html());*/

								google.maps.event.addListener(infowindow, 'domready', function(a,b,c,d, i) {
									/*onload();*/
									/*compile(infowindow)(scope);*/									
									compile($('.filter-depot.button'))(scope);
								});

								mapsService.setMarker({
									marker: marker,
									infowindow: infowindow
								});
							}
									
							
							angular.forEach(mapsService.getMarkers(), function(obj, i) {
								google.maps.event.addListener(obj.marker, 'click', function() {

									/*var onload = function() {
					                	scope.$apply(function() {
					                  		compile(document.getElementById("reparse_helper_"+marker.id))($scope)
					                	});
					              	};
									if (!infowindow[marker.id]) {
										infowindow[marker.id] = new google.maps.InfoWindow({
											content: content
										});
										google.maps.event.addListener(infowindow[marker.id], 'domready', function(a,b,c,d) {
					                 	onload();
					                	});
					                }*/
																

									/////
									/*var selectedIndex = tabsService.getSelectedIndex();
									var depotId = coordinates[i].id;*/

									angular.forEach(mapsService.getMarkers(), function(obj2, i2) {
										obj2.infowindow.close();
									});

							    	obj.infowindow.open(map, obj.marker);
							    	/*compile($('#filter-depot-button-' + selectedIndex + '-' + depotId))(scope);*/
							  	});
							});

							/*scope.setUserLocation();*/
							if(coordinates.length > 0) {								
								map.setCenter(new google.maps.LatLng(coordinates[0].lat, coordinates[0].lon));
							}

							map.setZoom(mapProperty.zoom);							
							scope.$apply();

						} else {
							/* car map view button */
							var carMarker = mapsService.getCarMarker();

							var addressLatLng = new google.maps.LatLng(carMarker.lat, carMarker.lng);
							var marker = new google.maps.Marker({
							    position: addressLatLng,
							    map: map
							});
							
							mapsService.setMarker({
								marker: marker
							});

							/*scope.setUserLocation();*/
							map.setCenter(addressLatLng);
							map.setZoom(mapProperty.zoom);
							scope.depotAddress = carMarker.address;
							scope.$apply();
						}					
					},
					onHidden: function() {
						var userMarker = mapsService.getUserMarker();

						modalsService.updateShowMapModal(false);						
						angular.forEach(mapsService.getMarkers(), function(obj, ind) {
							obj.marker.setMap(null);
						});

						if(userMarker != null) {
							userMarker.setMap(null);
							/*mapsService.clearUserMarker();*/
						}
						
						mapsService.clearMarkers();
						scope.$apply();
					}
				});

				

				scope.$watch('modals.showMapModal', function(newVal, oldVal) {
					if(newVal != oldVal) {
						if(newVal) {
							elem.modal('show');
						} else {
							elem.modal('hide');
						}
					}
				});
			}
		};
	}]);


	resultsDirective.directive('showCarFromMapAction', ['ModalsService', 'MapsService', function(modalsService, mapsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					mapsService.setCarMarker({
						lat: attrs.lat,
						lng: attrs.lng,
						address: attrs.depotAddress
					});
					mapsService.setIsMapViewFlag(false);
					modalsService.updateShowMapModal(true);
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('mapViewButtonAction', ['ModalsService', 'MapsService',  function(modalsService, mapsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					mapsService.setIsMapViewFlag(true);
					modalsService.updateShowMapModal(true);
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('loadingVehiclesDimmerAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.dimmer({
					closable: false
				});

				scope.$watch('modals.showLoadingVehicle', function(newVal, oldVal) {
					if(newVal != undefined) {
						if(newVal) {
							elem.dimmer('show');
						} else {
							elem.dimmer('hide');
						}	
					}					
				});
			}
		};
	});

	resultsDirective.directive('sortAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				/*scope.*/
			}
		};
	});



	resultsDirective.directive('clearPickupDateAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					console.log(elem.closest('.content').find('.datepicker').datepick('getDate'));
				});
			}
		};
	});

	resultsDirective.directive('clearReturnDateAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					console.log(elem.closest('content').find('.datepicker').datepick('getDate'));
				});
			}
		};
	});

	resultsDirective.directive('tabContainerAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('selectedIndex', function(newVal, oldVal) {
					
					if(elem.index() == newVal) {
						if(!elem.is(':visible')) {							
							elem.fadeIn(400, function() {								
								$('.filter.price').ionRangeSlider('update', {type: 'double'});
								$('.filter.distance').ionRangeSlider('update', {type: 'double'});
							});
						}						
					} else {
						if(elem.is(':visible')) {
							elem.hide();
						}						
					}
				});
			}
		};
	});

	resultsDirective.directive('tabAction', ['TabsService', 'SearchBarService', function(tabsService, searchBarService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {					
					if(!elem.hasClass('active')) {
						tabsService.setSelectedIndex(elem.index());
						var selectedTab = tabsService.getSelectedTab();
						var searchBarParams = searchBarService.getSearchBarParams();

						searchBarParams.pickupLocation.id = selectedTab.pickupLocation.id;
						searchBarParams.pickupLocation.value = selectedTab.pickupLocation.value;

						searchBarParams.returnLocation.id = selectedTab.returnLocation.id;
						searchBarParams.returnLocation.value = selectedTab.returnLocation.value;

						searchBarParams.pickupDate.date = selectedTab.pickupDate.date;
						searchBarParams.pickupDate.time = selectedTab.pickupDate.time;
						searchBarParams.pickupDate.display = selectedTab.pickupDate.display;

						searchBarParams.returnDate.date = selectedTab.returnDate.date;
						searchBarParams.returnDate.time = selectedTab.returnDate.time;
						searchBarParams.returnDate.display = selectedTab.returnDate.display;

						searchBarParams.driverAge.value = selectedTab.driverAge.value;
						searchBarParams.userCountry.value = selectedTab.userCountry.value;
						
						scope.$apply();
					}
				});
			}
		};
	}]);

	resultsDirective.directive('featureAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.popup({
					position: 'top center'
				});
			}
		};
	});

	resultsDirective.directive('tabFavoriteAction', [
		'LocalStorageService', 
		'FavoriteTabsService',
		function(localStorageService, favoriteTabsService) {
			return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
					elem.click(function(e) {
						e.stopPropagation();
						
						var favoriteTabs = favoriteTabsService.getFavoriteTabs();
						
						if(scope.$parent.tabs[scope.$index].favorited) {
							
							var favoriteIndex = favoriteTabsService.validateFavorite(scope.$parent.tabs[scope.$index]);
							
							if(favoriteIndex != -1) {
								favoriteTabs.splice(favoriteIndex, 1);
							}

							scope.$parent.tabs[scope.$index].favorited = false;
						} else {
							/* add it to local storage */
							favoriteTabs.push({
								pickupLocation: {
									id: scope.tab.pickupLocation.id,
									value: scope.tab.pickupLocation.value
								},
								returnLocation: {
									id: scope.tab.returnLocation.id,
									value: scope.tab.returnLocation.value
								},
								pickupDate: {
									date: scope.tab.pickupDate.date,
									time: scope.tab.pickupDate.time,
									display: scope.tab.pickupDate.display
								},
								returnDate: {
									date: scope.tab.returnDate.date,
									time: scope.tab.returnDate.time,
									display: scope.tab.returnDate.display	
								},
								driverAge: {
									value: scope.tab.driverAge.value
								},
								userCountry: {
									value: scope.tab.userCountry.value
								}
							});

							scope.$parent.tabs[scope.$index].favorited = true;
						}

						localStorageService.removeItem('favoriteTabs');
						localStorageService.setItem('favoriteTabs', JSON.stringify(favoriteTabs));
						scope.$apply();
					});

					elem.popup({					
						position: 'right center',
						offset: -55
					});
				}
			};
		}
	]);


	resultsDirective.directive('searchButtonAction', [
		'TabsService', 
		'ModalsService', 
		'VehiclesService', 
		'DateTimeService',
		function(tabsService, modalsService, vehiclesService, dateTimeService) {
			return {
				restrict: 'A',
				link: function(scope, elem, attrs) {
					elem.click(function() {

						var pickupDate = scope.pickupDate.date;
						var pickupTime = scope.pickupDate.time;
						var returnDate = scope.returnDate.date;
						var returnTime = scope.returnDate.time;						
						var pickupLocationId = scope.pickupLocation.id;
						var pickupLocationDisplay = scope.pickupLocation.value;
						var returnLocationId = scope.returnLocation.id;
						var returnLocationDisplay = scope.returnLocation.value;

						var toProceed = true;						

						if(pickupDate == '') {
							alert('Pickup date is required');
							toProceed = false;
						}

						if(pickupTime == '') {
							alert('Pickup time is required');
							toProceed = false;	
						}

						if(returnDate == '') {
							alert('Return date is required');
							toProceed = false;
						}

						if(returnTime == '') {
							alert('Return time is required');
							toProceed = false;	
						}

						if(pickupDate != '' && pickupTime != '' && returnDate != '' && returnTime != '') {
							var objPickupDateTime = new Date(pickupDate + ' ' + pickupTime);
							var objReturnDateTime = new Date(returnDate + ' ' + returnTime);

							if(objPickupDateTime > objReturnDateTime) {
								alert('Pickup datetime must be greater than Return datetime');
								toProceed = false;
							}

							if(objPickupDateTime == objReturnDateTime) {
								alert('Pickup datetime must not be equal to return datetime');
								toProceed = false;
							}	
						}

						if(pickupLocationDisplay == '') {
							alert('Pickup location is required');
							toProceed = false;
						} else {
							if(pickupLocationId == '') {
								/*alert('Pickup location not existing on the list');*/
								alert('Pickup location is required');
								toProceed = false;
							}
						}

						if(returnLocationDisplay == '') {
							alert('Return location is required');
							toProceed = false;
						} else {
							if(returnLocationId == '') {
								/*alert('Return location not existing on the list');*/
								alert('Return location is required');
								toProceed = false;
							}
						}

						if(toProceed) {
							tabsService.incrementSelectedIndex();
							scope.searchVehicles();
						}						
					});
				}
			};
		}
	]);

	resultsDirective.directive('styleTimepicker', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				
				elem.scroller({
	            	theme: 'ios7',
	            	animate: '',
	            	lang: '',
	            	height: 25,
	            	preset: 'time',
	            	stepMinute: 5,
	            	mode: 'mixed',
	            	display: 'inline',
	            	onChange: function() {            		
	            		/*$('.ui.setter.date').addClass('animated pulse');
	            		$('.ui.setter.date').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
							$(this).removeClass('animated pulse');
						});*/
	            	}
	            });

				if(attrs.fieldType == 'pickup') {
					elem.scroller('setValue', scope.pickupDate.time);
				} else if(attrs.fieldType == 'return') {
					elem.scroller('setValue', scope.returnDate.time);
				}
	            
			}
		};
	});

	resultsDirective.directive('initializeDropdownAction', ['$timeout', function(timeout) {
		return {
			restrict: 'A',
			scope: {
				emitName: '@',
				dropdownModel: '='
			},
			link: function(scope, elem, attrs) {

				scope.$parent.$on(scope.emitName, function() {
					timeout(function() {
						elem.dropdown({
							onChange: function(value, text) {
								scope.dropdownModel.value = value;
								scope.$apply();
							}
						});
						elem.dropdown('set selected', scope.dropdownModel.value);
					}, 1);
				});
				
				scope.$watch('dropdownModel', function(newValue, oldValue) {
					if(newValue != oldValue) {
						elem.dropdown('set selected', newValue.value);
					}
				}, true);
			}
		};
	}]);

	resultsDirective.directive('watchDropdownItem', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				if(scope.$last === true) {
					scope.$emit(attrs.emitName);	
				}
			}
		};
	});

	resultsDirective.directive('distanceUnitDropdownAction', ['TabsService', 'MapsService', 'ResultsDistanceUnitService', 'CustomerService', function(tabsService, mapsService, resultsDistanceUnitService, customerService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('distanceUnit.value', function(newVal, oldVal) {
					if(newVal != oldVal && oldVal != '') {
						var distanceUnit = resultsDistanceUnitService.getDistanceUnit();
												
						var allTabs = tabsService.getTabs();
						var customer = customerService.getCustomer();

						if(customer.email != '') {
							customerService.updateDistanceUnit(newVal);
						}
						angular.forEach(allTabs, function(perTab, perTabInd) {

							if(perTab.userLocation.location.id != '') {
								var placeDetailsService = new google.maps.places.PlacesService(mapsService.getMap());
																
								placeDetailsService.getDetails({
									placeId: perTab.userLocation.location.id
								}, function(place, status2) {

									if(status2 == 'OK') {
										var lat = place.geometry.location.k;
										var lng = place.geometry.location.B;
										var min_userDistance = '';
										var max_userDistance = '';
										allTabs[perTabInd].userLocation.coordinates.lat = lat;
										allTabs[perTabInd].userLocation.coordinates.lng = lng;

										var origin = new google.maps.LatLng(lat, lng);
															
										angular.forEach(perTab.vehicles, function(vehicle, ind) {
											var destination = new google.maps.LatLng(vehicle.depot_information.lat, vehicle.depot_information.lon);
											var distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);

											if(newVal == 'km') {
												distance = distance / 1000;
											}
											
											allTabs[perTabInd].vehicles[ind].userDistance = parseFloat(distance.toFixed(1));
											
											angular.forEach(perTab.filters.depot.choices, function(filterDepotObj, filterDepotInd) {
												if(filterDepotObj.id == vehicle.depot_information.depotId) {
													allTabs[perTabInd].filters.depot.choices[filterDepotInd].userDistance = parseFloat(distance.toFixed(1));
												}
											});

											if(max_userDistance == '') {
												max_userDistance = distance.toFixed(1);
											} else {
												if(parseFloat(distance.toFixed(1)) > parseFloat(max_userDistance)) {
													max_userDistance = distance.toFixed(1);
												}
											}

											if(min_userDistance == '') {
												min_userDistance = distance.toFixed(1);	
											} else {
												if(parseFloat(distance.toFixed(1)) < parseFloat(min_userDistance)) {
													min_userDistance = distance.toFixed(1);
												}
											}								
										});

										allTabs[perTabInd].filters.userDistance.max = parseFloat(max_userDistance);
										allTabs[perTabInd].filters.userDistance.value.max = parseFloat(max_userDistance);
										allTabs[perTabInd].filters.userDistance.min = parseFloat(min_userDistance);
										allTabs[perTabInd].filters.userDistance.value.min = parseFloat(min_userDistance);									
									}
								});	
							}
						});					
					}
				});
				
			}
		};
	}]);

	resultsDirective.directive('currencyDropdownAction', ['CurrencyService', 'TabsService', 'CustomerService', function(currencyService, tabsService, customerService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('currency.value', function(newVal, oldVal) {
					if(newVal != oldVal && oldVal != '') {
						var customer = customerService.getCustomer();

						if(customer.email != '') {
							customerService.updateCurrency(newVal);
						}

						currencyService.getConversionRate(newVal).then(function(data) {
							var allTabs = tabsService.getTabs();							
							var originalPrice;
							var price;
							var conversionRate;

							var aud_rate;
							var comms_currency_value;
							var maxPrice;
							var minPrice;

							conversionRate = data.conversionRate;
							aud_rate = data['AUD_RATE'];


							angular.forEach(allTabs, function(perTab, perTabInd) {

								maxPrice = '';
								minPrice = '';								
								angular.forEach(perTab.vehicles, function(vehicle, vehicleInd) {
									/* 
										real code for conversion
										allTabs[perTabInd].vehicles[vehicleInd]['currency'] = newVal;
										originalPrice = allTabs[perTabInd].vehicles[vehicleInd]['originalPrice'];
										allTabs[perTabInd].vehicles[vehicleInd]['price'] = originalPrice * data.conversionRate;
									*/

									originalPrice = allTabs[perTabInd].vehicles[vehicleInd]['originalPrice'];
									comms_currency_value = originalPrice / aud_rate;
									price = comms_currency_value * conversionRate;

									if(minPrice == '') {
										minPrice = price;
									} else {
										if(price < minPrice) {
											minPrice = price;
										}
									}

									if(maxPrice == '') {
										maxPrice = price;
									} else {
										if(price > maxPrice) {
											maxPrice = price;
										}
									}

									allTabs[perTabInd].vehicles[vehicleInd]['currency'] = newVal;
									allTabs[perTabInd].vehicles[vehicleInd]['price'] = parseFloat(price.toFixed(2));
								});
	
								allTabs[perTabInd].filters.price.max = parseFloat(maxPrice.toFixed(2));
								allTabs[perTabInd].filters.price.value.max = parseFloat(maxPrice.toFixed(2));
								allTabs[perTabInd].filters.price.min = parseFloat(minPrice.toFixed(2));
								allTabs[perTabInd].filters.price.value.min = parseFloat(minPrice.toFixed(2));
							});

							
						});
					}
				});
			}
		};
	}]);
	
	resultsDirective.directive('initializeIonRangeSlider', ['$timeout', 'TabsService', 'ResultsDistanceUnitService', function(timeout, tabsService, resultsDistanceUnitService) {
		return {
			restrict: 'A',
			scope: {
				sliderAttrs: '=',
				filter: '@'
			},
			link: function(scope, elem, attrs) {
				
				scope.selectedTab = tabsService.getSelectedTab();
				
				var tabFiltersWatch = scope.$watch('selectedTab.filters.' + attrs.filter, function(newVal, oldVal) {
					if(newVal != oldVal) {
						if(newVal.min == newVal.max) {
							elem.ionRangeSlider('update', {
								disable: true
							});
						} else {
							var ionRangeSliderOptions = {};

							if(isEmptyObject(oldVal)) {																					
								ionRangeSliderOptions.from = parseFloat(newVal.min);
								ionRangeSliderOptions.to = parseFloat(newVal.max);
								ionRangeSliderOptions.min = parseFloat(newVal.min);
								ionRangeSliderOptions.max = parseFloat(newVal.max);						
							} else {
								var hasChange = false;
								

								if(newVal.min != oldVal.min) {
									ionRangeSliderOptions.min = parseFloat(newVal.min);
									ionRangeSliderOptions.from = parseFloat(newVal.min);
									hasChange = true;
								}

								if(newVal.max != oldVal.max) {
									ionRangeSliderOptions.max = parseFloat(newVal.max);
									ionRangeSliderOptions.to = parseFloat(newVal.max);
									hasChange = true;
								}

								if(attrs.filter == 'price' || attrs.filter == 'userDistance') {
									var allTabs = tabsService.getTabs();
									var postfix;
								}

								if(attrs.filter == 'price' && hasChange) {
									
									angular.forEach(allTabs, function(perTab, perTabInd) {

										postfix = '';

										angular.forEach(perTab.vehicles, function(vehicle, vehicleInd) {
											if(postfix == '') {
												postfix = vehicle.currency;
											}
										});
									});
									ionRangeSliderOptions.postfix = ' ' + postfix;
								}

								if(attrs.filter == 'userDistance' && hasChange) {
									var distanceUnit = resultsDistanceUnitService.getDistanceUnit();									
									ionRangeSliderOptions.postfix = ' ' + distanceUnit.value;
								}
							}
							
							if(!isEmptyObject(ionRangeSliderOptions)) {
								ionRangeSliderOptions.disable = false;
								elem.ionRangeSlider('update', ionRangeSliderOptions);
							}							
						}
						/*tabFiltersWatch();*/
					}
				}, true);
				
				if(attrs.filter == 'userDistance') {
					
					var userDistanceWatch = scope.$watch('selectedTab.filters.userDistance', function(newVal, oldVal) {
												
						if(newVal != oldVal && oldVal != undefined) {
							newUserDistanceFilter = newVal;
							oldUserDistanceFilter = oldVal;
							
							if(newUserDistanceFilter.value != oldUserDistanceFilter.value && newUserDistanceFilter.value != '') {
								
								if(oldUserDistanceFilter.value.min == "" && oldUserDistanceFilter.value.max == "") {
									
									var distanceUnit = resultsDistanceUnitService.getDistanceUnit();
									
									elem.ionRangeSlider('update', {
										min: newUserDistanceFilter.min,
										max: newUserDistanceFilter.max,
										from: newUserDistanceFilter.min,
										to: newUserDistanceFilter.max,
										postfix: ' ' + distanceUnit.value,
										disable: false
									});									
								}								
							}
						}
					}, true);
				}

				elem.ionRangeSlider(scope.sliderAttrs);

				elem.ionRangeSlider('update', {
					onChange: function(obj) {
						var fromNumber = obj.fromNumber;
						var toNumber = obj.toNumber;

						var filterIdentifier = elem.attr('filter');						
						scope.selectedTab.filters[filterIdentifier].value.min = fromNumber;
						scope.selectedTab.filters[filterIdentifier].value.max = toNumber;
						if(!scope.$$phase) {
							scope.$apply();
						}
					}
				});			
			}
		};
	}]);
		
	resultsDirective.directive('optionMultipleFilterButtonAction', ['TabsService', function(tabsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {				
				elem.click(function() {
					var id = $(this).attr('data-value');
					var selectedTab = tabsService.getSelectedTab();
					selectedTab.filters[attrs.filter].value = id;
					scope.$apply();					
				});					
			}
		};
	}]);

	resultsDirective.directive('clearFilterButton', ['TabsService', function(tabsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					var selectedTab = tabsService.getSelectedTab();
					var selectedIndex = tabsService.getSelectedIndex();

					selectedTab.filters.aircon.value = '';
					selectedTab.filters.transmission.value = '';
					selectedTab.filters.distance.value = '';
					selectedTab.filters.airport.value = '';
				
					$.each($('.slider-filter-' + selectedIndex), function(ind, objElem) {
						if($(this).attr('filter') != 'userDistance') {
							$(this).ionRangeSlider('update',  {
								from: selectedTab.filters[$(this).attr('filter')].min,
								to: selectedTab.filters[$(this).attr('filter')].max,
							});
							selectedTab.filters[$(this).attr('filter')].value.min = selectedTab.filters[$(this).attr('filter')].min;
							selectedTab.filters[$(this).attr('filter')].value.max = selectedTab.filters[$(this).attr('filter')].max;	
						}
					});
					
					$.each($('.checkbox-filter-' + selectedIndex), function(ind, objElem) {
						$(this).checkbox('enable');
					});
					
					
					if(!scope.$$phase) {
						scope.$apply();
					}				
				});
			}
		};
	}]);

	resultsDirective.directive('sortTypeCheckboxAction', ['$timeout', function(timeout) {
		return {
			restrict: 'A',
			scope: {
				sortReverse: '='
			},
			link: function(scope, elem, attrs) {
				timeout(function() {
					elem.checkbox({
						onEnable: function() {
							scope.sortReverse = true;
							scope.$apply();
						},
						onDisable: function() {
							scope.sortReverse = false;
							scope.$apply();
						}
					});
					elem.checkbox('enable');
				}, 1);
			}
		};
	}]);

	resultsDirective.directive('optionFilterButtonAction', ['TabsService', function(tabsService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					var selectedTab = tabsService.getSelectedTab();

					if(selectedTab.filters[attrs.filter].value == true) {
						selectedTab.filters[attrs.filter].value = '';
					} else {
						selectedTab.filters[attrs.filter].value = true;
					}
					scope.$apply();
				});
			}
		};
	}]);

	resultsDirective.directive('checkboxFilterAction', ['$timeout', 'TabsService', function(timeout, tabsService) {
		return {
			restrict: 'A',
			scope: {

			},
			link: function(scope, elem, attrs) {
				
				scope.selectedTab = tabsService.getSelectedTab();
				
				/*scope.$watch('selectedTab.filters', function(newVal, oldVal) {
					if(newVal != oldVal) {
						var filter = newVal;
						var toEnable = false;

						angular.forEach(filter.value, function(obj, ind) {
							if(obj.id == elem.attr('data-id')) {								
								toEnable = true;
							}
						});

						if(toEnable) {
							elem.checkbox('enable');
						} else {
							elem.checkbox('disable');
						}
					}
				}, true);*/

				timeout(function() {
					var vehicleIdentifier = elem.attr('vehicle-identifier');
					var filterIdentifier = elem.attr('filter');
					var id = elem.attr('data-id');
					var name = elem.attr('data-choice-name');

					elem.checkbox({
						onEnable: function() {							
							var exists = false;
							angular.forEach(scope.selectedTab.filters[filterIdentifier].value, function(obj, ind) {
								if(obj.id == id) {
									exists = true;
								}
							});

							if(!exists) {
								scope.selectedTab.filters[filterIdentifier].value.push({
									id: id,
									name: name
								});
								if(!scope.$$phase) {
									scope.$apply();
								}
							}							
						},
						onDisable: function() {							
							angular.forEach(scope.selectedTab.filters[filterIdentifier].value, function(obj, ind) {
								if(obj.id == id) {
									scope.selectedTab.filters[filterIdentifier].value.splice(ind, 1);
									if(!scope.$$phase) {
										scope.$apply();
									}
								}
							});						
						}
					});
					elem.checkbox('enable');
				}, 1);
			}
		};
	}]);
})();