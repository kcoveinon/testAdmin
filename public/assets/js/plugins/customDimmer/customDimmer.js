(function() {
    var customDimmer = angular.module('customDimmer', []);

	customDimmer.directive('customDimmer', ['customDimmerService', function(customDimmerService) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
	            watch: '=',
	            settings: '=?'
	        },
	        link: function(scope, element, attrs){

	        	scope.settings = scope.settings || {};

	        	if(!customDimmerService.dimmerExists(attrs.watch)){
	        		setDimmer();
	        		initWatch();
	        		customDimmerService.registerDimmer(attrs.watch);
	        	}else{
	        		//console.log('Warning: The watch you are trying to use already belongs to other dimmer');
	        	}


	        	function setDimmer(){
		        	element.dimmer(scope.settings);
		        }

		        function initWatch(){
		        	scope.$watch('watch', function(command) {

                    	if (command) {
							element.dimmer('show');	        	
						} else{
							element.dimmer('hide');
						}

	                });
				}

		    }
	    };
	}]);

	customDimmer.service('customDimmerService', [function() {

		var _existingDimmers = [];

		this.registerDimmer = function(dimmerWatch) {
			_existingDimmers.push(dimmerWatch);
		};

		this.dimmerExists = function(dimmerWatch) {
			return ($.inArray(dimmerWatch, _existingDimmers)!=-1);
		};

    }]);

})();