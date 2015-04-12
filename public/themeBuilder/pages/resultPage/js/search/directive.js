(function() {
	var searchDirective = angular.module('search-directive', []);

	searchDirective.directive('pickupLocationAction', ['locationService', '$timeout', function(locService, timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var promiseTimeout;
				elem.val('');
				scope.$watch('pickupLocation', function(newVal, oldVal) {
					if(newVal.value != '' && newVal.id != '') {
						if(scope.initialSearch) {
							scope.initialSearch = false;
							
							timeout(function() {
								scope.showOther = true;
								scope.editPickupDate = true;
							}, 800);
						} else {
							scope.editPickupDate = true;
						}

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
								scope.locations = [];
								scope.$apply();
							} else {
								
								/*scope.$apply();*/
								timeout.cancel(promiseTimeout);
								promiseTimeout = timeout(function() {
									scope.pickupLocationQuerying = true;
									locService.getLocations(pickupLocationText).then(function(locations) {
										scope.locations = locations;
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

	searchDirective.directive('returnLocationAction', ['locationService', '$timeout', function(locService, timeout) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {

				var promiseTimeout;
				elem.val('');
				scope.$watch('returnLocation', function(newVal, oldVal) {
					if(newVal.value != '' && newVal.id != '') {
						if(scope.showOther) {
							scope.editPickupDate = true;	
						} else {
							timeout(function() {								
								scope.editPickupDate = true;
							}, 800);
						}
						elem.val(newVal.value);
					}
				}, true);

				elem.keyup(function(e) {
					var returnLocationText = elem.val();
					scope.returnLocation.id = '';
					scope.isSameLocation.value = false;

					if(!scope.$$phase) {
						scope.$apply();
					}

					if((e.keyCode < 37 || e.keyCode > 40)) {
						if(e.keyCode != 13) {
							if(returnLocationText == '') {
								scope.locations = [];
								scope.$apply();
							} else {
								
								/*scope.$apply();*/
								timeout.cancel(promiseTimeout);
								promiseTimeout = timeout(function() {
									scope.returnLocationQuerying = true;
									locService.getLocations(returnLocationText).then(function(locations) {
										scope.locations = locations;
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
		
	searchDirective.directive('sameReturnLocationAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.checkbox({
					onEnable: function() {
						scope.returnLocation.id = scope.pickupLocation.id;
						scope.returnLocation.value = scope.pickupLocation.value;
						scope.isSameLocation.value = true;
					},
					onDisable: function() {
						scope.isSameLocation.value = false;
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

	searchDirective.directive('loginViaGoogleAction', ['$window', function(win) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					win.location.href = 'loginvia/google-response-url/' + scope.alias;
				});
			}
		};
	}]);

	searchDirective.directive('loginViaVroomAction', ['$window', function(win) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					win.location.href = 'loginvia/vroom/' + scope.alias;
				});
			}
		};
	}]);

	searchDirective.directive('accountDropdownAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.dropdown({
					onChange: function(text, value) {

					}
				});
			}
		};
	});

	searchDirective.directive('otherFieldAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('showOther', function(newVal, oldVal) {
					if(newVal != oldVal) {
						if(newVal) {
							elem.fadeIn(400, function() {
								scope.$apply();
							});
						}
					}
				});
			}
		};
	});

	searchDirective.directive('dateFieldAction', function() {
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

	searchDirective.directive('buttonLogoutAction', ['AuthenticationService', '$window', function(authenticationService, win) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					authenticationService.logout().then(function(data) {
						if(data.result == 'success') {
							win.location.reload(true);
						}
					});
				});
			}
		}
	}]);

	searchDirective.directive('otherButtonAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				scope.$watch('showOther', function(newVal, oldVal) {
					if(newVal != oldVal) {
						if(newVal) {
							elem.css('display', 'inline-block');
						}
					}
				});
			}
		};
	});

	searchDirective.directive('datepickerAction', ['$compile', function(compile) {
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
									scope.$apply();
								});
							}
						}
					}, true);

					elem.focus(function() {
						scope.editReturnDate = false;
						scope.$apply();
					});*/

					/*scope.$watch('editPickupDate', function(newVal, oldVal) {
						if(newVal != oldVal) {
							if(newVal == false) {
								if(elem.popup('exists')) {
									elem.popup('hide', function() {
										scope.editReturnDate = true;

										if(!scope.$$phase) {
										  scope.$apply();
										}
										
									});
								}
							} else {
								if(!elem.popup('is visible')) {
									elem.popup('show');
								}
							}
						}
					});*/
					//

					$(document).click(function(e) { 					
						if(!$(e.target).closest('.popup').length) {
							if(!$(e.target).closest('.datepick').length) {
								if(elem.popup('is visible')) {
									scope.editPickupDate = false;
									scope.$apply();
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
								}
							} else {
								if(!elem.popup('is visible')) {
									elem.popup('show');
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
					}, true);
			
					scope.$watch('editReturnDate', function(newVal, oldVal) {
						if(newVal == true) {
							elem.trigger('focus');
							elem.trigger('click');
						}
					});*/

					//

					$(document).click(function(e) { 					
						if(!$(e.target).closest('.popup').length) {
							if(!$(e.target).closest('.datepick').length) {
								if(elem.popup('is visible')) {
									scope.editReturnDate = false;
									scope.$apply();
								}
							}
						}
					});

					scope.$watch('editReturnDate', function(newVal, oldVal) {
						if(newVal == false) {
							if(elem.popup('exists')) {
								elem.popup('hide');
							}
						} else {
							if(!elem.popup('is visible')) {
								elem.popup('show');
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

	
	searchDirective.directive('closePickupDateAction', function() {
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

	searchDirective.directive('closeReturnDateAction', function() {
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


	searchDirective.directive('setPickupDateAction', ['DateTimeService', function(dateTimeService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					/*var datepicker = elem.closest('.content').find('.datepicker');
					var timepicker = elem.closest('.content').find('.input.timepicker');
					
					var pickupTime;
					var tmp_pickupDate = datepicker.datepick('getDate')[0];
					var tmp_pickupTime = timepicker.scroller('getDate');
							
					pickupTime = tmp_pickupTime.toTimeString().split(' ');
					pickupTime = pickupTime[0];
					pickupTime = pickupTime.split(':');
					pickupTime = pickupTime[0] + ':' + pickupTime[1];
									
					scope.pickupDate.date = $.datepick.formatDate('yyyy-mm-dd', tmp_pickupDate)					
					scope.pickupDate.time = pickupTime;

					pickupTime = tmp_pickupTime.toLocaleTimeString().split(' ');
					tmp_pickupTime = pickupTime[0].split(':');
					pickupTime = tmp_pickupTime[0] + ':' + tmp_pickupTime[1] + ' ' + pickupTime[1];				
					scope.pickupDate.display = $.datepick.formatDate('M dd, yyyy', tmp_pickupDate) + ' ' + pickupTime;
					scope.$apply();	*/

					//
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

	searchDirective.directive('setReturnDateAction', ['DateTimeService', function(dateTimeService) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					/*var datepicker = elem.closest('.content').find('.datepicker');
					var timepicker = elem.closest('.content').find('.input.timepicker');				
					
					var returnTime;
					var tmp_returnDate = datepicker.datepick('getDate')[1];
					var tmp_returnTime = timepicker.scroller('getDate');
							
					returnTime = tmp_returnTime.toTimeString().split(' ');
					returnTime = returnTime[0];
					returnTime = returnTime.split(':');
					returnTime = returnTime[0] + ':' + returnTime[1];
						
					scope.returnDate.date = '';					
					scope.returnDate.date = $.datepick.formatDate('yyyy-mm-dd', tmp_returnDate);
					scope.returnDate.time = returnTime;

					returnTime = tmp_returnTime.toLocaleTimeString().split(' ');
					tmp_returnTime = returnTime[0].split(':');
					returnTime = tmp_returnTime[0] + ':' + tmp_returnTime[1] + ' ' + returnTime[1];				
					scope.returnDate.display = $.datepick.formatDate('M dd, yyyy', tmp_returnDate) + ' ' + returnTime;
					scope.$apply();*/	

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

	searchDirective.directive('styleTimepicker', function() {
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
	            	stepMinute: 5,
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

	searchDirective.directive('initializeDropdownAction', ['$timeout', function(timeout) {
		return {
			restrict: 'A',
			scope: {
				model: '='
			},
			link: function(scope, elem, attrs) {
				/*alert(scope.$last);*/
				if(scope.$parent.$last) {
					timeout(function() {
						elem.closest('.dropdown').dropdown({
							onChange: function(val, text) {
								scope.model.value = val;
								scope.$apply();
							}
						});						
						elem.closest('.dropdown').dropdown('set selected', scope.model.value);
					}, 1);
				}
			}
		};
	}]);

	searchDirective.directive('searchButtonAction', ['$window', function(win) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					var pickupDate = scope.pickupDate.date;
					var pickupTime = scope.pickupDate.time;
					var returnDate = scope.returnDate.date;
					var returnTime = scope.returnDate.time;
					var userCountry = scope.userCountry.value;
					var driverAge = scope.driverAge.value;
					var pickupLocationId = scope.pickupLocation.id;
					var pickupLocationDisplay = scope.pickupLocation.value;
					var returnLocationId = scope.returnLocation.id;
					var returnLocationDisplay = scope.returnLocation.value;
					var alias = scope.alias;
				
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
						win.location = alias + '/'  + pickupDate + '/' + pickupTime + '/' + returnDate + '/' + returnTime + '/' + pickupLocationId + '/' + returnLocationId + '/' + userCountry + '/' + driverAge;					
					}
					
				});
			}
		};
	}]);
})();