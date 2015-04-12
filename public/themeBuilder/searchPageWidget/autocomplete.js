(function() {
	var autocompleteDirective = angular.module('autocomplete', ['ngSanitize']);


	autocompleteDirective.directive('autocomplete', ['$interpolate', function(interpolate) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				data: '=',
				selected: '=?',
				customClass: '@',
				customSelected: '=?'
			},
			transclude: true,
			controller: ['$scope', function(scope) {
				scope.highlighted = 0;

				this.getDataCount = function() {
					return scope.data.length;
				};
			}],
			template: '<table class="autocomplete directive ui basic table ' + interpolate.startSymbol() + ' customClass ' + interpolate.endSymbol() + '"> \
					<tbody> \
						<tr node-id="' + interpolate.startSymbol() + ' datum.id ' + interpolate.endSymbol() + '" node-value="' + interpolate.startSymbol() + ' datum.value ' + interpolate.endSymbol() + '" ng-class="{\'active\': highlighted == \'<% $index %>\'}" autocomplete-node-action ng-repeat="datum in data"> \
							<td class="autocomplete-node" ng-bind-html="datum.display"></td> \
						</tr> \
					</tbody> \
				</table>',
			link: function(scope, elem, attrs) {
				/*<td>' + interpolate.startSymbol() + ' datum.display ' + interpolate.startSymbol() + ' </td> \*/

				scope.$watch('data', function(newVal, oldVal) {
					if(newVal != oldVal) {
						scope.highlighted = 0;
					}
				}, true);

				elem.prev().keyup(function(e) {
					if(scope.data.length > 0) {
						if(e.keyCode == 38) {
							/* up arrow */

							if(elem.find('tr.active').length == 0) {
								/* no highlighted */
								elem.find('tr').last().addClass('active');
								
								scope.highlighted = elem.find('tr').length - 1;
							} else {
								/* there is highlighted */

								if((scope.highlighted -1) < 0) {
									/* end of row */
									scope.highlighted = elem.find('tr').length - 1;
								} else {
									/* proceed to next row */
									scope.highlighted--;
								}
							}
							scope.$apply();
						} else if(e.keyCode == 40) {
							/* down arrow */							

							if(elem.find('tr.active').length == 0) {
								/* no highlighted */
								scope.highlighted++;
							} else {
								/* there is highlighted */

								if(scope.highlighted + 1 > (elem.find('tr').length-1)) {
									/* end of row */
									scope.highlighted = 0;
								} else {
									/* proceed to next row */
									scope.highlighted++;
								}
							}
							scope.$apply();
						} else if(e.keyCode == 13) {
							/* pressed enter */
							scope.highlighted = 0;
							scope.selected.id = elem.find('tr.active').attr('node-id');
							scope.selected.value = elem.find('tr.active').attr('node-value');
							elem.hide();
							if(scope.customSelected != undefined) {
								scope.customSelected = true;
							}
							scope.$apply();
						} else {
							scope.highlighted = 0;
							scope.$apply();
						}
					}
				});

				scope.$watch('selected', function(newVal, oldVal) {
					if(newVal != undefined) {
						if(newVal.id != '') {
							elem.prev().val(newVal.value);
							scope.data = [];							
						}
					}					
				}, true);
			}
		};
	}]);


	autocompleteDirective.directive('autocompleteNodeAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.mouseover(function() {
					scope.$parent.highlighted = elem.index();
					scope.$apply();
				});
				
				elem.click(function() {
					elem.closest('table').hide();
					scope.$parent.highlighted = 0;
					scope.selected.id = elem.attr('node-id');
					scope.selected.value = elem.attr('node-value');
					if(scope.$parent.customSelected != undefined) {
						scope.$parent.customSelected = true;
					}
					scope.$apply();
				});
			}
		};
	});

	$(document).click(function(event) {
	    if(!$(event.target).closest('.autocomplete').length) {
	        if($('.autocomplete').is(":visible")) {
	            $('.autocomplete').hide();	            
	        }
	    }
	});
})();