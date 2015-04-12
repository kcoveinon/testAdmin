(function() {
	var searchController = angular.module('search-controller', []);

	searchController.controller('SearchController', [
		'$scope',
		'ServerDataService', 
		'AgeService', 
		'CountryService',
		'SearchBarService',
		'SiteService',
		'$rootScope',
		function(scope, serverDataService, ageService, countryService, searchBarService, siteService, rootScope) {

			
			scope.locations = [];
			scope.ages = [];
			scope.countries = [];
			scope.email = '';

			scope.pickupLocationQuerying = false;
			scope.returnLocationQuerying = false;
			scope.editReturnDate = false;
			scope.editPickupDate = false;
			scope.initialSearch = true;
			scope.alias = rootScope.alias;
			searchBarService.resetSearchBarParams();
			scope.searchBarParams = searchBarService.getSearchBarParams();
			scope.searchBarParams.driverAge.value = '25+';
			scope.searchBarParams.userCountry.value = 'AU';

			scope.pickupLocation = scope.searchBarParams.pickupLocation;

			scope.returnLocation = scope.searchBarParams.returnLocation;

			scope.pickupDate = scope.searchBarParams.pickupDate;

			scope.returnDate = scope.searchBarParams.returnDate;
			
			scope.userCountry = scope.searchBarParams.userCountry;

			scope.driverAge = scope.searchBarParams.driverAge;

			scope.isSameLocation = scope.searchBarParams.isSameLocation;
			
			scope.server = {
				date: {}
			}

			/*siteService.setSiteToSession(scope.alias).then(function(data) {

			});*/
			
			serverDataService.getServerDate({
				dateFormat: 'Y-m-d',
				timeFormat: 'H:i',
				modify: '+1 day'
			}).then(function(data) {
				
				scope.server.date = data.dates;
				scope.pickupDate.date = scope.server.date.date;
				scope.pickupDate.time = '10:00';
				/*scope.pickupDate.time = scope.server.date.time;*/

				var pickupDateTime = new Date(scope.pickupDate.date + ' ' + scope.pickupDate.time);
				/*var pickupDateTime = new Date(scope.server.date.datetime);*/
				var pickupTime = pickupDateTime.toLocaleTimeString();
				var pickupTimeSuffix;

				pickupTime = pickupTime.split(' ');
				pickupTimeSuffix = pickupTime[1];
				pickupTime = pickupTime[0].split(':');			
				pickupTime = pickupTime[0] + ':' + pickupTime[1] + ' ' + pickupTimeSuffix;
					
				scope.pickupDate.display = $.datepick.formatDate('M dd, yyyy', pickupDateTime) + ' ' + pickupTime;
			});
			/*
			ageService.getAges().then(function(data) {
				scope.ages = data.ages;
			});
			*/

			scope.ages = ["25+"];

			/*
			countryService.getCountries().then(function(data) {
				scope.countries = data.countries;
			});
			*/

			scope.countries = [{"code":"AU","name":"Australia"}];

			serverDataService.getServerDate({
				dateFormat: 'Y-m-d',
				timeFormat: 'H:i',
				modify: '+3 days'
			}).then(function(data) {
				scope.server.date = data.dates;
				scope.returnDate.date = scope.server.date.date;
				scope.returnDate.time = '10:00';
				/*scope.returnDate.time = scope.server.date.time;*/

				var returnDateTime = new Date(scope.returnDate.date + ' ' + scope.returnDate.time);
				/*var returnDateTime = new Date(scope.server.date.datetime);*/
				var returnTime = returnDateTime.toLocaleTimeString();
				var returnTimeSuffix;

				returnTime = returnTime.split(' ');
				returnTimeSuffix = returnTime[1];
				returnTime = returnTime[0].split(':');
				returnTime = returnTime[0] + ':' + returnTime[1] + ' ' + returnTimeSuffix;

				scope.returnDate.display = $.datepick.formatDate('M dd, yyyy', returnDateTime) + ' ' + returnTime;
			});
		}
	]);

	
})();