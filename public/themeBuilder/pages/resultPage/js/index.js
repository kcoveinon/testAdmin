'use strict'

/* factory of places to be used in the pickup place field */
vroomApp.factory('places', function() {
	return [];
});


vroomApp.controller('IndexController', function IndexController($scope, $http, places) {
	$scope.places = places;
	$scope.placesTimeout = null;
	$scope.autocomplete_index = 0;
	$('.secondary').hide();
	
	var interval = 5, 
		timeArray = [],
		time_hour_text,
		time_min_text,
		tmp_date,
		h,
		suff;

	tmp_date = current_date;
	h = tmp_date.getHours() + 12;
	suff = 'AM';

	timeArray.push(h + ':0' + tmp_date.getMinutes() + ' ' + suff);

	for(var i=0;i<287;i++) {

	  time_hour_text = "";
	  time_min_text = "";
	  tmp_date.setMinutes(tmp_date.getMinutes() + interval);

	  h = tmp_date.getHours();


	  if(h < 12) {	  	
	  	suff = 'AM';
	  } else {
	  	suff = 'PM';
	  }

	  if(h == 0) {
	  	h = 12;
	  } else if( h > 12) {
	  	h -= 12;
	  }

	  if(h < 10) {
	  	time_hour_text = "0" + h;
	  } else {
	  	time_hour_text = h;
	  }

	  if(tmp_date.getMinutes() < 10) {
	  	time_min_text = "0" + tmp_date.getMinutes();
	  } else {
	  	time_min_text = tmp_date.getMinutes();
	  }

	  timeArray.push(time_hour_text + ':' + time_min_text + ' ' + suff);
	}
		
	$('html').click(function(e) {
		//Hide the menus if visible
		/*alert($scope.autocomplete_index);*/
		var to_hide;
		to_hide = false;


		if(!$(e.target).hasClass('.inp.place')) {
			$('.autocomplete').hide();
		}

		if($('.ui.popup').length > 0) {
			if($('.ui.popup').attr('class') != $(e.target).attr('class') && $(e.target).closest('.ui.popup').attr('class') != $('.ui.popup').attr('class') && $(e.target).closest('.datepick').length == 0) {
				if($(e.target).attr('id') != 'returnDate') {
					if($(e.target).attr('id') != 'pickupDate') {
						/*$('.pdate').popup('hide');	*/
						to_hide = true;
					}					
				}

				if($(e.target).attr('id') != 'pickupDate') {
					if($(e.target).attr('id') != 'returnDate') {
						/*$('.pdate').popup('hide');*/
						to_hide = true;
					}					
				}
			}	
		}

		if(to_hide) {
			$('.pdate').popup('hide');
		}
		
	});

	$scope.place_enter_leave = function(ind) {
		$scope.autocomplete_index = ind;
	};

	$scope.pick_place = function(el) {
		var obj;

		if(el.length > 0) {
			obj = el;
		} else {
			obj = $(this);
		}

		$('.pickup.place').find('input').attr('loc_id', obj.attr('id'));
		$('body').css('background-image', 'url("img/background/' + obj.attr('id') + '_1.jpg")');
		obj.closest('table').prev().val(obj.find('.place.span').attr('place'));
		obj.closest('table').hide();

		if(!$('.pickup.place').hasClass('sec')) {
			$('.pickup.place').addClass('sec');

			/*$('.pickup.place').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){				
				$('.secondary').fadeIn();
				$('#pickupDate').focus();
			});*/

			setTimeout(function() {
				$('.secondary').fadeIn();
				$('#pickupDate').focus();	
			}, 500);
			
		} else {
			$('#pickupDate').focus();
		}
	}
	
	$scope.setterPStatus = 'disabled';
	$scope.setterRStatus = 'disabled';
	$scope.timeArray = timeArray;
});

vroomApp.directive('searchCarAction', function($http) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.mouseover(function() {
				elem.removeClass('animated pulse');
			});
			
			elem.click(function() {

				var tmpPTime = new Date();
				var tmpRTime = new Date();

				tmpPTime.setTime($('#pickupDate').attr('tval'));
				tmpRTime.setTime($('#returnDate').attr('tval'));

				

				var pTime = tmpPTime.toTimeString().split(' ');
				var rTime = tmpRTime.toTimeString().split(' ');
				var pDate = $('#pickupDate').attr('nval');
				var rDate = $('#returnDate').attr('nval');

				var cCountryID = $('.country.dropdown').dropdown('get value');				
				var driverAge = $('.age.dropdown').dropdown('get value');
				var pDateTime = pDate + 'T' + pTime[0];
				var pLocID = $('.pickup.place').find('input').attr('loc_id');
				var rDateTime = rDate + 'T' + rTime[0];
				var rLocID = $('.pickup.place').find('input').attr('loc_id');
				
				window.location = 'results?pDate=' + pDate + '&' + 'pTime=' + pTime[0] + '&' + 'rDate=' + 
					rDate + '&' + 'rTime=' + rTime[0] + '&' + 'cCountryID=' + cCountryID + '&' + 'age=' + driverAge + 
					'&' + 'pLocID=' + pLocID + '&' + 'rLocID=' + rLocID;
			});
		}
	};
});

vroomApp.directive('placesAction', function($http) {
	return {
		restrict: 'A',		
		link: function(scope, elem, attrs) {
			var obj_autocomplete = elem.next();

			elem.bind('keyup', function(e) {
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

					scope.pick_place(obj_autocomplete.find("td.active"));
					
				} else if(e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode == 192 || e.keyCode == 8 || e.keyCode == 186 || e.keyCode == 189 || e.keyCode == 187 || e.keyCode == 222 || e.keyCode == 188 || e.keyCode == 190) {
					$('.pickup.place').find('input').attr('loc_id', '');
					if(obj_autocomplete.children().children().length == 0) {
						obj_autocomplete.hide();
					}
									
					clearTimeout(scope.placesTimeout);

				    if(elem.val() != '') {
				    	scope.$apply(function() {
				    		scope.placesTimeout = setTimeout(function() {				        	
					        	$http.get('places/10/' +  elem.val())
									.success(function(data, status, headers, config) {									
										if(data.length != 0) {
											scope.places = [];												
											angular.forEach(data, function(value, index) {
												scope.places.push(value);
											});	
											scope.autocomplete_index = 0;
																				
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
			elem.bind('focus', function() {
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
				var pickupDate;
				var tElementHTML = ' \
						<div class="timepicker"> \
							<input type="text" class="timepickerE" style-timepicker /> \
						</div> \
						<div class="ui small green button setter date" setter-pickup-date-action>Next</div>';

				var tElement = $(tElementHTML);
				$('.datepick').closest('.ui.popup').find('.content').append(tElement);
				$compile(tElement)(scope);

				$('.date-header').addClass('animated pulse');
				$('.date-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$(this).removeClass('animated pulse');
				});

				if($('#pickupDate').attr('nval') == '') {
					pickupDate = current_date;
				} else {
					pickupDate = new Date($('#pickupDate').attr('nval'));
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

						$('#pickupDate').attr('nval', arr_tmp_from_date[0]);
															
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
				$('.datepick').closest('.ui.popup').removeClass("pickupDate returnDate");
				$('.datepick').closest('.ui.popup').addClass('returnDate');					

				
				var pickupDateVal,
					returnDateVal;

				var tElementHTML = ' \
						<div class="timepicker"> \
							<input type="text" class="timepickerE" style-timepicker /> \
						</div> \
						<div class="ui small green button setter date" setter-return-date-action>Next</div>';

				var tElement = $(tElementHTML);
				$('.datepick').closest('.ui.popup').find('.content').append(tElement);						
				$compile(tElement)(scope);

				if($('#pickupDate').attr('nval') != '') {
					pickupDateVal = new Date($('#pickupDate').attr('nval'));
				}

				if($('#returnDate').attr('nval') != '') {
					returnDateVal = new Date($('#returnDate').attr('nval'));
				}

				$('.date-header').html("What return date?");
				$('.time-header').html("What return time?");
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

						if($('#pickupDate').val() == '') {
							$('#pickupDate').focus();
						} else {
							var arr_tmp_to_date = tmp_to_date.toISOString().split("T");
							$('#returnDate').attr('nval', arr_tmp_to_date[0]);
							$('.datepick').datepick('setDate', new Date($('#pickupDate').attr('nval')), new Date(tmp_to_date));
							$('.time-header').addClass('animated pulse');
							$('.time-header').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
								$(this).removeClass('animated pulse');
							});
						} 
					}
				});
				
				$('.datepick').closest('.ui.popup').addClass(attrs.id);			
			};
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

vroomApp.directive('setterPickupDateAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {
				var pickupDate = $("#pickupDate").attr('nval');
				var tvalue = $('.timepickerE').scroller('getDate');
				var h,m,suff;

				pickupDate = new Date(pickupDate);

				h = tvalue.getHours();
				m = tvalue.getMinutes();

				pickupDate.setHours(tvalue.getHours());
				pickupDate.setMinutes(tvalue.getMinutes());

				if(h == 0) {
					h = 12;
					suff = 'AM';
				} else if(h < 12) {
					suff = 'AM';
				} else {
					suff = 'PM';
					h -= 12;
				}

				if(h < 10) {
					h = "0" + h;
				}

				if(m < 10) {
					m = "0" + m;
				}

				$('#pickupDate').attr('tval', tvalue.getTime());

				scope.$apply(function() {
					scope.pickup_date_model = month[pickupDate.getMonth()] + ' ' + pickupDate.getDate() + ' ' + h + ":" + m + " " + suff;					
				});

				$('.pdate').popup('hide', function() {
					$('#returnDate').focus();					
				});	
			});
		}
	};
});


vroomApp.directive('setterReturnDateAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.click(function() {


				if($('#pickupDate').val() == '') {
					$('#pickupDate').focus();
					return false;
				}
				var returnDate = $("#returnDate").attr('nval');
				var tvalue = $('.timepickerE').scroller('getDate');
				var h,m,suff;

				returnDate = new Date(returnDate);
				h = tvalue.getHours();
				m = tvalue.getMinutes();

				returnDate.setHours(tvalue.getHours());
				returnDate.setMinutes(tvalue.getMinutes());

				if(h == 0) {
					h = 12;
					suff = 'AM';
				} else if(h < 12) {
					suff = 'AM';
				} else {
					suff = 'PM';
					h -= 12;
				}

				if(h < 10) {
					h = "0" + h;
				}

				if(m < 10) {
					m = "0" + m;
				}		

				$('#returnDate').attr('tval', tvalue.getTime());

				scope.$apply(function() {
					scope.return_date_model = month[returnDate.getMonth()] + ' ' + returnDate.getDate() + ' ' + h + ":" + m + " " + suff;
				});

				$('.pdate').popup('hide');
				$('.ui.search.button').addClass('animated pulse');
			});
		}
	};
});

vroomApp.directive('autocompleteFieldAction', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {	
			elem.children().bind('click', scope.pick_place);
			
			elem.bind('mouseover', function() {
				var tr;

				tr = $(this);
				scope.$apply(function() {
					scope.$parent.autocomplete_index = tr.parent().find('tr').index(tr);
				});
			});
		}
	}
});