(function() {
	var registrationController = angular.module('registration-controller', []);

	registrationController.controller('RegistrationController', ['$scope','GenderService', 'CountryService', function(scope, genderService, countryService) {

		scope.newCustomer = {
			email: '',
			title: '',
			firstName: '',
			lastName: '',
			gender: '',
			country: ''
		};

		scope.genders = [];
		scope.countries = [];

		genderService.getGenders().then(function(data) {
			scope.genders = data.genders;
		});

		/*
		countryService.getCountries().then(function(data) {
			scope.countries = data.countries;
		});
		*/
		
		scope.countries = [{"code":"AU","name":"Australia"}];

		scope.bindParams = function(email, firstName, lastName, gender) {
			scope.newCustomer.email = email;
			scope.newCustomer.firstName = firstName;
			scope.newCustomer.lastName = lastName;
			scope.newCustomer.gender = gender;
		}
	}]);
})();