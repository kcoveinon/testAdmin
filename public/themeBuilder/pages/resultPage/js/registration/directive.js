(function() {
	var registrationDirective = angular.module('registration-directive', []);

	registrationDirective.directive('initializeDropdownAction', ['$timeout', function(timeout) {
		return {
			restrict: 'A',
			scope: {
				dropdownModel: '=',
				emitName: '@'
			},
			link: function(scope, elem, attrs) {

				scope.$parent.$on(attrs.emitName, function() {
					timeout(function() {
						elem.dropdown({
							onChange: function(value, text) {
								scope.dropdownModel = value;
								scope.$apply();
							}
						});
						elem.dropdown('set selected', scope.dropdownModel);
					}, 1);
				});

				scope.$watch('dropdownModel', function(newValue, oldValue) {
					if(newValue != oldValue) {
						elem.dropdown('set selected', newValue);
					}
				});
			}
		};
	}]);

	registrationDirective.directive('buttonRegisterAction', ['RegistrationService', '$rootScope', function(registrationService, rootScope) {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				elem.click(function() {
					registrationService.registerCustomer(scope.newCustomer).then(function(data) {
						if(data.result == 'success') {
							window.location = rootScope.baseUrl;
						}
					});
				});
			}
		};
	}]);

	registrationDirective.directive('watchDropdownItem', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attrs) {
				if(scope.$last === true) {
					scope.$emit(attrs.emitName);	
				}
			}
		};
	});
})();