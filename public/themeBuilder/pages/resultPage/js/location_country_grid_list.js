(function() {
	var vroomApp = angular.module('vroomApp', ['grid-directive']);

	vroomApp.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('<%').endSymbol('%>');
	});

	vroomApp.controller('LocationCountryGridCtrl', ['$scope', function(scope) {
		/*scope.table_columns = [{
			header: 'Country ID',
			model: 'ACountryID',
			search_type: 'text'	
		},{
			header: 'Location Name',
			model: 'ACountryName',
			search_type: 'text'
		},{
			header: 'Country ID',
			model: 'ACountryID',
			search_type: 'text'
		},{
			header: 'Country Name',
			model: 'ACountryCode',
			search_type: 'text'
		},{
			header: 'Total Location',
			model: 'TotalALocationID',
			search_type: 'text'
		},{
			header: 'Action3',
			content: '<div class="ui small button" test-action>View2</div> <div class="ui small button">Delete</div>',
			model: 'action2',
			append: true
		}];*/

		scope.table_columns = [{
			header: 'Supplier Name',
			model: 'ASupplierName',
			search_type: 'text'
		}, {
			header: 'Confirmation Number',
			model: 'ABookingConfirmation',
			search_type: 'text'
		}, {
			header: 'Booking Date',
			model: 'ABookDate',
			search_type: 'text'
		}, {
			header: 'Pickup Location',
			model: 'APickupLocation',
			search_type: 'text'
		}, {
			header: 'Return Location',
			model: 'AReturnLocation',
			search_type: 'text'
		}, {
			header: 'Pickup Date',
			model: 'APickupDate',
			search_type: 'range_date'
		}, {
			header: 'Return Date',
			model: 'AReturnDate',
			search_type: 'text'
		}, {
			header: 'Customer Name',
			model: 'ACustomerName',
			search_type: 'text'
		}, {
			header: 'Booking Cost',
			model: 'ABookingCost',
			search_type: 'text'
		}, {
			header: 'Booking Total Cost',
			model: 'ABookingTotalCost',
			search_type: 'text'
		}];
	}]);

	vroomApp.directive('testAction', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					alert('hello');
				});
			}
		}
	});

})();