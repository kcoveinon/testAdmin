(function() {
	var grid_directive = angular.module('grid-directive', []);
	

	$(document).click(function(e) {

		if($(e.target).closest('.ui.popup').length == 0 && 
			!$(e.target).hasClass('icon filter') &&
			$(e.target).closest('.ui-datepicker').length == 0 &&
			$(e.target).closest('.ui-datepicker-header').length == 0
		) {
			$('.icon.filter').removeClass('clicked');
			$(".ui.popup").popup('hide');
		}
	});

	grid_directive.factory('interpolateFactory', ['$interpolate', function(interp) {
		return {
			start_symbol: interp.startSymbol(),
			end_symbol: interp.endSymbol()
		};
	}]);

	grid_directive.directive('jGrid', ['interpolateFactory', function(interpF) {
		var start_symbol;
		var end_symbol;

		start_symbol = interpF.start_symbol;
		end_symbol = interpF.end_symbol;
		
		return {
			restrict: 'E',	
			replace: true,			
			scope: {
				gridColumns: '=',
				gridMethod: '@',
				gridUrl: '@',
				gridLimit: '@',
				gridOffset: '@',
				gridOrderBy: '@',				
				gridOrderType: '@',
				gridDataType: '@',
				gridId: '@',
				gridPostData: '=?',
				gridExportUrl: '@',
				gridHeight: '@'
			},			
			controller: ['$scope', '$http','$sce', function(scope, http, sce) {
								
				scope.gridDirectiveClass = 'grid-directive';
				scope.gridRows = [];				
				scope.dimmer_dot_class = '';
				scope.total_rows = -1;
				scope.where = [];
				scope.rows = [];
				scope.sortedBy = scope.gridSortedBy;
				scope.sortedType = true;
				scope.totalPage = 0;
				scope.columns = Array();
				scope.currentPage = 1;
				scope.tmpCurrentPage = 1;
				scope.pagination_msg = '';
				/*scope.resizable_enabled = null;*/

				/*angular.forEach(scope.gridColumns, function(col) {
					scope.columns.push(col.model);
				})*/

				function getData() {
					angular.element(scope.dimmer_dot_class).dimmer('show');					
					
					var http_options = {};								
					scope.total_rows = -1;

					http_options = {
						method: scope.gridMethod,
						url: scope.gridUrl,
						dataType: scope.gridDataType
					};

					if(scope.gridMethod == 'POST') {
						var http_data = {};						
						http_data.limit = scope.gridLimit;
						http_data.offset = scope.gridOffset;
						http_data.where = scope.where;
						http_data.post_data = scope.gridPostData;
						http_data.order = {
							column: scope.gridOrderBy,
							type: scope.gridOrderType
						};
						http_options.data = http_data;
					} else {
						var arr_http_url;

						arr_http_url = {
							limit: scope.gridLimit,
							offset: scope.gridOffset,
							order: {column: scope.gridOrderBy,type: scope.gridOrderType},
							where: []
						};

						if(scope.where.length > 0) {
							arr_http_url.where = scope.where;
						}

						http_options.url += '/' + JSON.stringify(arr_http_url);					
					}

					http(http_options).success(function(data) {

						/*if(scope.resizable_enabled == null) {
							scope.resizable_enabled = false;
						}*/
						scope.rows = data.data;
						scope.total_rows = data.count;
						scope.totalPage = data.total_pages;

						var to_prepend_arr;

						to_prepend_arr = [];
						angular.forEach(scope.gridColumns, function(obj, ind) {
							var col_obj = obj;
							if(obj.append == true) {
								angular.forEach(scope.rows, function(row_obj, ind_obj) {
									var model;
									var content;
									
									model = col_obj.model;
									content = col_obj.content;

									row_obj[model] = content;
									
									scope.rows[ind_obj] = row_obj;
								});
							}
						});

						/* set height */
						var screen_height;
						var grid_directive_top;
						var expected_addl_height;
						var grid_directive_elem;

						if(scope.gridId != '' && scope.gridId != undefined) {
							grid_directive_elem = $('#' + scope.gridId);
						} else {
							grid_directive_elem = $('.' + scope.gridDirectiveClass);	
						}						

						if(scope.gridHeight != '') {
							grid_directive_elem.find('.div-table-body').css('height', scope.gridHeight);
						} else {
							screen_height = $(window).height();

							grid_directive_top = $('.grid-directive').offset().top;

							expected_addl_height = screen_height - grid_directive_top;
							expected_addl_height = expected_addl_height - grid_directive_elem.find('.div-table-header').height() - grid_directive_elem.find('.div-table-filter-header').height() - grid_directive_elem.find('.div-table-footer').height();
							expected_addl_height -= 15;
							grid_directive_elem.find('.div-table-body').css('height', expected_addl_height + 'px');
						}
						
						angular.element(scope.dimmer_dot_class).dimmer('hide');
					}).error(function(data) {
						alert('there is a problem with your request');
					});
				};

				this.getData = function() {
					getData();
				};

				this.getColumnLength = function() {
					return scope.gridColumns.length;
				};

				this.setWhere = function(where) {					
					var exists;
					var exist_index;

					exists = scope.where.some(function(where_datum, index, array) {
						exist_index = index;
						return (where_datum.column == where.column);
					});

					if(where.value != undefined) {
						if(where.search_type == 'dropdown') {
							if(where.value === 'true') {
								where.value = true;
							} else if(where.value === 'false') {
								where.value = false;
							}
						}
					}
					if(!exists) {
						scope.where.push(where);
					} else {
						scope.where[exist_index] = where
					}
				};

				this.accumulateOffset = function() {
					scope.$apply(function() {
						
						scope.gridOffset = parseInt(scope.gridOffset) + parseInt(scope.gridLimit);

						scope.tmpCurrentPage++;
						scope.pagination_msg = '';
						scope.currentPage = scope.tmpCurrentPage;
					});
					
				};

				this.decumulateOffset = function() {
					scope.$apply(function() {
						/*scope.gridOffset = parseInt(scope.gridOffset) - parseInt(scope.gridLimit);*/
						scope.gridOffset = parseInt(scope.gridOffset) - parseInt(scope.gridLimit);
						scope.tmpCurrentPage--;
						scope.pagination_msg = '';
						scope.currentPage = scope.tmpCurrentPage;
					});
				};

				this.setDimmerClass = function(dimmer_dot_class) {
					scope.dimmer_dot_class = dimmer_dot_class;
				}

				this.observeGridNext = function(obj) {
					
					scope.$watch('total_rows', function(newValue, oldValue) {
						
						if((parseInt(scope.currentPage) * parseInt(scope.gridLimit)) >= newValue) {
							if(parseInt(newValue) != 0) {
								obj.addClass('disabled');
							}
						} else {
							obj.removeClass('disabled');
						}
					}, true);
				};

				this.observeGridPrev = function(obj) {
					
					scope.$watch('total_rows', function(newValue, oldValue) {
						if(parseInt(scope.gridOffset) <= 0) {
							obj.addClass('disabled');
						} else {
							obj.removeClass('disabled');
						}
					}, true);
				};
							
			}],
			template: ' \
				<div id="' + start_symbol + ' gridId ' + end_symbol + '" class="' + start_symbol + ' gridDirectiveClass ' + end_symbol + ' ui dimmable" style="border-left: 1px solid rgba(0, 0, 0, 0.1); border-right: 1px solid rgba(0, 0, 0, 0.1)"> \
					<div class="div-table-header"> \
						<table class="ui sortable table" resizable-action> \
							<thead> \
								<tr> \
									<th ng-repeat="column in gridColumns" column-alias="' + start_symbol + ' column.model ' + end_symbol + '" percent-width="' + start_symbol + ' column.width ' + end_symbol + '" grid-th-action style="vertical-align: middle;white-space: normal !important; font-size: .7rem; text-transform: uppercase;border-right: 1px solid rgba(0, 0, 0, 0.1);width: ' + start_symbol + ' column.width ' + end_symbol + ';" ng-class="{ nosort: column.append == true }"> \
										' + start_symbol + ' column.header ' + end_symbol + ' \
										<span style="float: right" ng-show="column.show_order" ng-switch="column.order_type"> \
											<i class="sort ascending icon" ng-switch-when="ASC"></i> \
											<i class="sort descending icon" ng-switch-when="DESC"></i> \
										</span> \
									</th> \
								</tr> \
							</thead> \
						</table> \
					</div> \
					<div class="div-table-filter-header"> \
						<table class="ui table"> \
							<thead> \
								<tr> \
									<th ng-repeat="column in gridColumns" style="vertical-align: middle;white-space: normal !important;border-right: 1px solid rgba(0, 0, 0, 0.1);width: ' + start_symbol + ' column.dynamic_width ' + end_symbol + ';" ng-switch="column.search_type"> \
										<div style="font-size: .8rem" ng-switch-when="undefined"> \
										</div> \
										<div style="font-size: .8rem; font-weight: normal" ng-switch-default> \
											<span>No filter</span> \
											<grid-filter-button column="column" popup-position="' + start_symbol + ' $index ' + end_symbol + '"></grid-filter-button></i> \
										</div> \
									</th> \
								</tr> \
							</thead> \
						</table> \
					</div> \
					<div class="div-table-body"> \
						<table class="ui celled table" style="table-layout:fixed"> \
							<tbody> \
								<tr ng-repeat="row in rows"> \
									<td style="word-wrap: break-word;" ng-repeat="column in gridColumns" style="width: ' + start_symbol + ' column.dynamic_width ' + end_symbol + ';" ng-switch="column.content"> \
										<span ng-switch-when="undefined">' + start_symbol + ' row[column.model] ' + end_symbol + ' </span> \
										<span ng-switch-default compile-bind-action="' + start_symbol + ' row[column.model] ' + end_symbol + '"></span> \
									</td> \
								</tr> \
							</tbody> \
						</table> \
					</div> \
					<div class="div-table-footer"> \
						<table class="ui celled table"> \
							<tfoot> \
						    	<tr> \
						    		<th colspan="' + start_symbol + ' gridColumns.length ' + end_symbol + '" style="border-right: none"> \
										<div class="ui form"> \
											<div class="inline fields"> \
												<div class="field" style="margin-bottom: 0"> \
													<grid-prev-button></grid-prev-button> \
												</div> \
												<div class="field" style="width: 7rem; margin-bottom: 0"> \
													<input type="text" style="width: 3rem;" ng-model="currentPage" page-number-action> \
													<label>of ' + start_symbol + ' totalPage ' + end_symbol + ' </label> \
												</div> \
												<div class="field" style="margin-bottom: 0"> \
													<grid-next-button></grid-next-button> \
												</div> \
												<div class="field" style="margin-bottom:0;margin-top: .5rem"> \
												<label>' + start_symbol + ' pagination_msg ' + end_symbol + '</label> \
												</div> \
											</div> \
										</div> \
										<!--<grid-pagination> \
											<grid-prev-button></grid-prev-button> \
											<a class="item" page-number-action ng-repeat="page in [] | range:totalPage" ng-class="{ \'active\' : gridOffset  == (page - 1) }"> \
    											' + start_symbol + ' page ' + end_symbol + ' \
  											</a> \
											<grid-next-button></grid-next-button> \
										</grid-pagination> -->\
						    		</th> \
						    		<th style="text-align: right; border-left: none" ng-switch="total_rows"> \
						    			<span ng-switch-when="-1">Total rows: 0</span> \
						    			<span ng-switch-default>Total rows: ' + start_symbol + ' total_rows ' + end_symbol + '</span> \
						    			<div style="margin-left: .5rem" class="ui refresh mini button" refresh-button-action> \
						    				<i class="refresh icon"></i> \
						    				Refresh \
						    			</div> \
						    			<div class="ui green mini button" export-grid-action> \
						    				<i class="download disk icon"></i> \
						    				Export to excel \
						    			</div> \
						    		</th> \
						  		</tr> \
						  	</tfoot> \
						</table> \
					</div> \
					<grid-dimmer></grid-dimmer> \
				</div> \
			',			
			link: function(scope, elem, attrs, jGridCtrl) {

				attrs.$observe('gridLimit', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridLimit = 50;
					}
				});

				attrs.$observe('gridWidth', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridWidth = '100%';
					}
				});

				attrs.$observe('gridHeight', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridHeight = '';
					}
				});

				attrs.$observe('gridExportUrl', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridExportUrl = '';
					}
				});

				attrs.$observe('gridOffset', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridOffset = 0;
					}
				});

				attrs.$observe('gridColumns', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridColumns = [];
					} else {
						angular.forEach(scope.gridColumns, function(obj, ind) {							
							scope.gridColumns[ind]['show_order'] = false;
							scope.gridColumns[ind]['order_type'] = 'ASC';
							
							if(obj.model == undefined) {
								scope.gridColumns[ind]['model'] = null;
							}
						});
					}
				});

				attrs.$observe('gridMethod', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridMethod = 'GET';
					} else {
						scope.gridMethod = scope.gridMethod.toUpperCase();
					}
				});

				attrs.$observe('gridDataType', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridDataType = 'JSON';
					}
				});

				attrs.$observe('gridUrl', function(val) {
					if(!angular.isDefined(val)) {
						alert('No URL Provided')
					}
				});

				attrs.$observe('gridPostData', function(val) {
					if(scope.gridMethod == 'POST') {
						if(!angular.isDefined(val)) {
							scope.gridPostData = {};
						}
					}
				});


				attrs.$observe('gridOrderType', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridOrderType = 'ASC';
					} else {
						scope.gridOrderType = scope.gridOrderType.toUpperCase();
					}
				});

				attrs.$observe('gridOrderBy', function(val) {
					if(!angular.isDefined(val)) {
						scope.gridOrderBy = scope.gridColumns[0].model;
						scope.gridColumns[0].show_order = true;
						scope.gridColumns[0].order_type =  'ASC';
					} else {
						angular.forEach(scope.gridColumns, function(obj, ind) {
							if(obj.model == val) {
								scope.gridColumns[ind].show_order =  true;
								scope.gridColumns[ind].order_type =  'ASC';
							}
						});
					}
					jGridCtrl.getData();
				});
			}
		};
	}]);
	
	/*grid_directive.directive('pageNumberAction', function() {
		return {
			restrict: 'A',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {
				elem.click(function() {
					scope.$apply(function() {
						scope.$parent.$parent.gridOffset = (scope.page - 1);
						jGridCtrl.getData();
					});					
				});
			}
		};
	});*/

	grid_directive.directive('exportGridAction', function($http, $window) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					if(scope.gridExportUrl == '') {
						alert('export url not defined');
					} else {
						/*$http({
							url: scope.gridExportUrl,
							method: 'GET',
							dataType: 'JSON'
						}).success(function(data) {

						}).error(function(data) {

						});*/
						var arr_http_url;
						var column_headers = [];

						angular.forEach(scope.gridColumns, function(row, ind) {
							column_headers.push(row.header);
						})
						
						console.log(column_headers);

						arr_http_url = {
							limit: 'nolimit',
							offset: 0,
							order: {column: scope.gridOrderBy,type: scope.gridOrderType},
							where: [],
							headers: column_headers
						};

						if(scope.where.length > 0) {
							arr_http_url.where = scope.where;
						}

						$window.location.href = scope.gridExportUrl + '/' + JSON.stringify(arr_http_url);
					}
					
				})
			}
		};
	});

	grid_directive.filter('range', function() {
		return function(arr, range) {
			range = parseInt(range);
			for(var i = 1; i <= range; i++) {
				arr.push(i);
			}
			return arr;
		}
	});

	grid_directive.directive('refreshButtonAction', function() {
		return {
			restrict: 'A',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {
				elem.click(function() {
					jGridCtrl.getData();
				});
			}
		};
	});

	grid_directive.directive('resizableAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				/*scope.$watch('resizable_enabled', function(newValue, oldValue) {
					if(newValue != oldValue) {
						if(newValue == false) {
							elem.colResizable();
							scope.resizable_enabled = true;
						}
					}
				});*/
			}
		};
	});
	grid_directive.directive('compileBindAction', function($compile) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				var e = $(attrs.compileBindAction);
				elem.html(e);
				$compile(e)(scope);
			}			
		};
	});

	grid_directive.directive('gridThAction', function() {
		return {
			restrict: 'A',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {

				var total_columns,
				total_percentage,
				total_columns_with_no_width,
				percentage_left;

				total_columns = scope.$parent.gridColumns.length;
				total_percentage = 0;
				total_columns_with_no_width = 0;
				percentage_left = 0;


				angular.forEach(scope.$parent.gridColumns, function(obj, ind) {
					if(obj.width == undefined) {
						total_columns_with_no_width++;
					} else {
						total_percentage += parseFloat(obj.width.replace('%',''));
					}
				});

				percentage_left = 100 - total_percentage;

				angular.forEach(scope.$parent.gridColumns, function(obj, ind) {
					if(attrs.columnAlias == obj.model) {
						if(attrs.percentWidth != '') {
							scope.$parent.gridColumns[ind]['dynamic_width'] = attrs.percentWidth;
						} else {
							scope.$parent.gridColumns[ind]['width'] = (percentage_left / total_columns_with_no_width) + '%';
							scope.$parent.gridColumns[ind]['dynamic_width'] = (percentage_left / total_columns_with_no_width) + '%';
						}
					}
				});

				elem.click(function() {

					if(!elem.hasClass('nosort')) {
						var same_header;
						same_header = false;
						var header_ind;

						angular.forEach(scope.$parent.gridColumns, function(obj, ind) {
							if(scope.column.model == obj.model) {
								if(obj.show_order) {
									same_header = true;
								}
								header_ind = ind;
							}
						});

						if(same_header) {
							scope.$apply(function() {
								if(scope.$parent.gridColumns[header_ind].order_type == 'ASC') {
									scope.$parent.gridColumns[header_ind].order_type = 'DESC';
								} else if(scope.$parent.gridColumns[header_ind].order_type == 'DESC') {
									scope.$parent.gridColumns[header_ind].order_type = 'ASC';
								}
								scope.$parent.gridOrderType = scope.$parent.gridColumns[header_ind].order_type;
							});											
						} else {
							scope.$apply(function() {
								angular.forEach(scope.$parent.gridColumns, function(obj, ind) {
									scope.$parent.gridColumns[ind].show_order = false;
								});
								scope.$parent.gridColumns[header_ind].show_order = true;
								scope.$parent.gridOrderBy = scope.column.model;
								scope.$parent.gridOrderType = 'ASC';	
							});
							
						}
						jGridCtrl.getData();
					}
				});				
			}
		};
	});

	grid_directive.directive('pageNumberAction', function() {
		return {
			restrict: 'A',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {
				elem.keyup(function(e) {
					if(e.keyCode == 13) {
						scope.$apply(function() {
							if(scope.currentPage == '') {
								scope.pagination_msg = 'No specified page number';
							} else if(isNaN(scope.currentPage)) {
								/*scope.currentPage = 1;*/
								scope.pagination_msg = 'Invalid page number';
							} else {
								if(parseFloat(scope.currentPage) % 1 != 0) {
									/* is decimal */
									scope.currentPage = Math.floor(parseFloat(scope.currentPage));
									scope.pagination_msg = '';
								} else {
									if(parseInt(scope.currentPage) > parseInt(scope.totalPage)) {
										/*scope.currentPage = 1;*/
										scope.pagination_msg = 'Page number should not be more than the total page';
									} else if(parseInt(scope.currentPage) <= 0) {
										/*scope.currentPage = 1;*/
										scope.pagination_msg = 'Page number should not be less than or equal to zero';
									} else {
										scope.gridOffset = (parseInt(scope.currentPage) - 1) * parseInt(scope.gridLimit);
										scope.pagination_msg = '';
									}	
								}							
							}
						});
						
						if(scope.pagination_msg == '') {
							scope.$apply(function() {
								scope.tmpCurrentPage = scope.currentPage;	
							});							
							jGridCtrl.getData();	
						}						
					}
				});
			}
		};
	})

	grid_directive.directive('gridFilterButton', function($compile) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				column: '=',
				popupPosition: '@'
			},
			require: '^jGrid',
			controller: ['$scope', function(scope) {
				scope.isClean;
				scope.isClean = true;
			}],
			template: '<i class="icon filter" ng-class="{dirty: !isClean}"></i>',
			link: function(scope, elem, attrs, jGridCtrl) {
				var data_content;
				var search_button;
				var filter_obj = elem;

				search_button = $('<div />');
				search_button.addClass('ui small search green button');
				search_button.append('<i class="icon search"></i>');

				switch(scope.column.search_type) {
					case 'text':
						scope.column_value = '';
						var input_text;
						data_content = $('<div />');
						data_content.addClass('ui action small input');
						search_button.css('width', '10%');
						input_text = $('<input type="text" ng-model="column_value" placeholder="Type something here..." />');
						
						data_content.append(input_text);
						data_content.append(search_button);
						break;
					case 'range_date':
						scope.from_column_value = '';
						scope.to_column_value = '';

						var inline_div;
						var date_from_field;
						var date_to_field;
						var date_label_field;
						var button_field;

						data_content = $('<div />');
						inline_div = $('<div />');
						data_content.addClass('ui form');						
						inline_div.addClass('inline fields');
						
						date_from_field = $('<div />');
						date_from_field.css('margin-bottom', '0');
						date_from_field.addClass('field');
						date_from_field.html('<div class="ui icon input"><input ng-model="from_column_value" grid-date-picker type="text" placeholder="From"><i class="calendar icon"></i></div>');

						date_label_field = $('<div />');
						date_label_field.css('margin-top', '2%');
						date_label_field.css('margin-bottom', '0');
						date_label_field.addClass('field');
						date_label_field.html('<label>to</label>');

						date_to_field = $('<div />');
						date_to_field.addClass('field');
						date_to_field.css('margin-bottom', '0');
						date_to_field.html('<div class="ui icon input"><input type="text" ng-model="to_column_value" grid-date-picker placeholder="To"><i class="calendar icon"></i></div>');

						search_button.css('padding-top', '19%');
						search_button.css('padding-bottom', '20%');

						button_field = $('<div />');
						button_field.addClass('field');
						button_field.css('margin-bottom', '0');
						button_field.append(search_button);

						inline_div.append(date_from_field);
						inline_div.append(date_label_field);
						inline_div.append(date_to_field);
						inline_div.append(button_field);

						data_content.append(inline_div);					
						break;
					case 'dropdown':
						scope.dropdown_column_value = '';
						data_content = $('<div />');

						var div_dropdown;

						
						div_dropdown = $('<div grid-dropdown dropdown-filter-action dropdown-column-model="dropdown_column_value" />');
						div_dropdown.addClass('ui fluid selection dropdown');

						var input_hidden;
						var dropdown_menu;

						input_hidden = $('<input type="hidden" ng-model="column_value"/>');
						
						div_dropdown.append(input_text);						
						div_dropdown.append('<div class="default text">Choose here</div>');

						dropdown_menu = $('<div />');
						dropdown_menu.addClass('menu');

						var dropdown_value;
						dropdown_value = $('<div />');

						dropdown_value.addClass('item');
						dropdown_value.attr('data-value', '');
						dropdown_value.html('Select All');
						dropdown_menu.append(dropdown_value);

						angular.forEach(scope.column.dropdown_values, function(dropdown) {
							var dropdown_value;
							dropdown_value = $('<div />');

							dropdown_value.addClass('item');
							dropdown_value.attr('data-value', dropdown.index);
							dropdown_value.html(dropdown.text);
							dropdown_menu.append(dropdown_value);
						});

						div_dropdown.append('<i class="dropdown icon"></i>');

						div_dropdown.append(dropdown_menu);
						data_content.append(div_dropdown);
						
						scope.$watch('dropdown_column_value', function(newValue, oldValue) {

							if(newValue != oldValue) {
								
								scope.$parent.$parent.$parent.gridOffset = 0;
								
								jGridCtrl.setWhere({
									search_type: scope.column.search_type,
									column: scope.column.model,
									value: newValue,
								});								
								if(newValue != '') {
									scope.isClean = false;
								} else {
									scope.isClean = true;
								}
								jGridCtrl.getData();

								filter_obj.popup('hide');
							}
							
						});
						break;
				};
				
				var popupPos;

				if((jGridCtrl.getColumnLength()-1) == scope.popupPosition) {
					popupPos = 'bottom left';
				} else if(scope.popupPosition == 0) {
					popupPos = 'bottom right';
				} else {
					popupPos = 'bottom center';
				}

				elem.popup({
					position: popupPos,
					preserve: true,
					inline: true,
					content: data_content.prop('outerHTML'),
					on: 'focus',					
					onCreate: function(obj) {
						var search_type = scope.column.search_type;
						
						$compile($(this))(scope);

						if(scope.column.search_type == 'range_date' || scope.column.search_type == 'dropdown') {
							$(this).addClass('nomaxwidth');
						}

						$(this).find('.search.button').click(function() {
							scope.$apply(function() {
								scope.$parent.$parent.$parent.gridOffset = 0;
							});

							filter_obj.popup('hide');
							filter_obj.removeClass('clicked');
							var filter_value;

							filter_value = 'No filter';

							switch(scope.column.search_type) {
								case 'text':
									jGridCtrl.setWhere({
										search_type: search_type,
										column: scope.column.model,
										value: scope.column_value
									});
									scope.$apply(function() {
										if(scope.column_value != '') {											
											scope.isClean = false;
										} else {
											scope.isClean = true;
										}
									});
									var filter_value;

									if(scope.column_value != '') {
										filter_value = scope.column_value;
									}

									filter_obj.closest('th').find('span').html(filter_value);
									break;
								case 'range_date':
									jGridCtrl.setWhere({
										search_type: search_type,
										column: scope.column.model,
										from_value: scope.from_column_value,
										to_value: scope.to_column_value
									});
									scope.$apply(function() {
										if(scope.from_column_value != '' || scope.to_column_value != '') {										
											scope.isClean = false;
										} else {
											scope.isClean = true;
										}
									});
									var filter_value;

									if(scope.from_column_value != '' && scope.to_column_value != '') {
										filter_value = scope.from_column_value + ' to ' + scope.to_column_value;
									}
									
									filter_obj.closest('th').find('span').html(filter_value);
									break;
							}

							jGridCtrl.getData();
						});
					}					
				});

				elem.click(function() {
					if(!elem.hasClass('clicked')) {
						$(document).popup('hide all');
						$('.icon.filter').removeClass('clicked');
						elem.addClass('clicked');
						elem.popup('show');
					}
				});				
			}
		};
	});
	
	grid_directive.directive('dropdownFilterAction', function() {
		return {
			restrict: 'A',
			scope: {
				dropdownColumnModel: '='				
			},
			priority: 2,			
			link: function(scope, elem, attr) {
				
				elem.dropdown('setting', {
					'onChange': function(value, text) {
						$('.icon.filter').removeClass('clicked');
						scope.$apply(function() {
							scope.dropdownColumnModel = value.toString();
							var filter_value;
							filter_value = 'No filter';

							if(value.toString() != '') {
								filter_value = text.toString();
							}
							elem.closest('th').find('span').html(filter_value);
						});									
					}
				});
			}
		};
	});

	grid_directive.directive('gridDropdown', function() {
		return {
			restrict: 'A',
			priority: 1,
			link: function(scope, elem, attrs) {
				elem.dropdown();
			}
		};
	});

	grid_directive.directive('gridDatePicker', function() {
		return {
			restrict: 'A',			
			link: function(scope, elem, attrs) {
				elem.datepicker({
					dateFormat: 'yy-mm-dd'
				});
			}
		};
	});

	grid_directive.directive('gridPrevButton', function() {
		return {
			restrict: 'E',
			replace: true,
			/*template: ' \
					<a class="icon item"> \
						<i class="left arrow icon"></i> \
					</a> \
			',*/
			template: ' \
					<div class="ui icon small button"> \
						<i class="left arrow icon"></i> \
					</div> \
			',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {
				elem.click(function() {
					if(!elem.hasClass('disabled')) {
						jGridCtrl.decumulateOffset();
						jGridCtrl.getData();
					}
				});

				jGridCtrl.observeGridPrev(elem);
			}
		};
	});

	grid_directive.directive('gridNextButton', function() {
		return {
			restrict: 'E',
			replace: true,
			/*template: ' \
					<a class="icon item"> \
						<i class="right arrow icon"></i> \
					</a> \
			',*/
			template: ' \
					<div class="ui icon small button"> \
						<i class="right arrow icon"></i> \
					</div> \
			',
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {				
				elem.click(function() {					
					if(!elem.hasClass('disabled')) {
						jGridCtrl.accumulateOffset();
						jGridCtrl.getData();
					}
				});

				jGridCtrl.observeGridNext(elem);
			}
		};
	});

	grid_directive.directive('gridPagination', function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,			
			template: ' \
				<div class="ui small pagination menu" ng-transclude> \
				</div> \
			',			
		};
	});
	
	grid_directive.directive('gridSearchOption', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				column: '='
			},
			template: '<div></div>',
			link: function(scope, elem, attrs) {
				var search_types = [
					'text',
					'dropdown',
					'range',
					'range_date',
					'range_datetime',
				];
				
				if(scope.column.search_type != undefined) {
					
					switch(scope.column.search_type) {
						case 'text': 
							var text_search = $('<div />');

							text_search.addClass('ui mini fluid input');
							text_search.append('<input type="text" placeholder="Search something here">');
							elem.append(text_search);	
							break;
						case 'dropdown': 
							var dropdown_search = $('<div />')
							dropdown_search.addClass('ui selection fluid mini dropdown');
							dropdown_search.append('<div class="text"></div><i class="dropdown icon"></i>');
							dropdown_search.append('<div class="menu" />');

							$.each(scope.column.search_options, function(index, value) {
								var opt = $('<div />');
								opt.addClass('item');
								opt.attr('data-value', value);
								opt.html(search_options_label[value]['text']);
								dropdown_search.find('.menu').append(opt);
							});
							elem.append(search_options);
							break;
					}
					
				} else {
					console.log('has no options');
				}					
			}
		};
	});

	grid_directive.directive('gridDimmer', ['$interpolate', function(interpF) {

		var start_symbol;
		var end_symbol;

		start_symbol = interpF.start_symbol;
		end_symbol = interpF.end_symbol;

		return {
			restrict: 'E',
			replace: true,
			template: ' \
				<div class="ui ' + start_symbol + ' gridId ' + end_symbol + 'grid dimmer" style="margin-left: 0%"> \
					<div class="content"> \
						<div class="center"> \
							<h2 class="ui header"> \
								<i class="fa fa-spinner fa-spin"></i> \
							</h2> \
						</div> \
					</div> \
				</div> \
			',
			controller: ['$scope', function(scope) {
				scope.obj_class = 'ui ' + scope.gridId + ' grid dimmer';

				if(scope.gridId != '' || scope.gridId != undefined) {
					scope.obj_dot_class = '.ui.' + scope.gridId + '.grid.dimmer';
				} else {
					scope.obj_dot_class = '.ui.grid.dimmer';	
				}
				
			}],
			require: '^jGrid',
			link: function(scope, elem, attrs, jGridCtrl) {
				elem.addClass(scope.obj_class);
				elem.dimmer({
					closable: false
				});
				jGridCtrl.setDimmerClass(scope.obj_dot_class);
			}
		};
	}]);
})();