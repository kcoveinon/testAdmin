(function() {
	var globalService = angular.module('globalService', []);

	globalService.provider('globalData', function() {
		this.symbol = {
			'start': '<%',
			'end': '%>'
		};
		
		this.$get = function() {
			var baseUrl = '';
			return {
				getBaseUrl: function() {
					return baseUrl;
				},
				setBaseUrl: function(baseUrl2) {
					baseUrl = baseUrl2;
				}
			};
		}

		this.getSymbols = function() {
			return this.symbol;
		}

	});

	globalService.service('AuthenticationService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		this.logout = function() {
			var dfd = q.defer();

			http({
				method: 'GET',
				url: rootScope.baseUrl + '/logout',
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		}
		
	}]);

	globalService.factory('ConstantsFactory', function() {
		var constants;
	});

	globalService.service('DateTimeService', function() {

		this.formatDateTimeForDisplay = function(date, time) {
			var dateTime = new Date(date + ' ' + time + ':00');
			var timeString = dateTime.toLocaleTimeString();			
			var tmpTimeString;

			timeString = timeString.split(' ');
			tmpTimeString = timeString[0].split(':');
			timeString = tmpTimeString[0] + ':' + tmpTimeString[1] + ' ' + timeString[1];

			return this.formatDate(dateTime, 'M dd, yyyy') + ' ' + timeString;
		}

		this.formatDateForDisplay = function(date) {
			var dt = new Date(date);

			return this.formatDate(dt, 'M dd, yyyy');
		};

		this.formatDate = function(date, format) {
			return $.datepick.formatDate(format, date);
		};

		this.convertToMilitaryTime = function(dateObj) {
			var time = dateObj.toTimeString().split(' ');
			time = time[0];
			time = time.split(':');
			time = time[0] + ':' + time[1];

			return time;
		};

		this.formatTimeForDisplay = function(date, time) {
			var dateTime = new Date(date + ' ' + time + ':00');
			var timeString = dateTime.toLocaleTimeString();			
			var tmpTimeString;

			timeString = timeString.split(' ');
			tmpTimeString = timeString[0].split(':');
			timeString = tmpTimeString[0] + ':' + tmpTimeString[1] + ' ' + timeString[1];

			return timeString;
		};
	});

	globalService.service('ServerDataService', ['$http','$q', '$rootScope', function(http, q, rootScope) {

		var baseUrl;
		this.getServerDate = function(obj) {
			var dfd = q.defer();

			if(obj.modify == undefined) {
				obj.modify = 'null';
			}

			http({
				method: 'GET',				
				url: rootScope.baseUrl + '/server/current-dates/' + obj.dateFormat + '/' + obj.timeFormat + '/' + obj.modify,
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function(data) {

			});

			return dfd.promise;
		};

		this.setBaseUrl = function(baseUrl) {
			this.baseUrl = baseUrl;
		};

		this.getBaseUrl = function() {

		}
	}]);
})();