(function() {
	var siteService = angular.module('site-service', []);

	siteService.service('SiteService', ['$http', '$q', function(http, q) {

		this.setSiteToSession = function(alias) {
			var dfd = q.defer();

			http({
				method: 'POST',
				url: 'site/set-to-session',
				dataType: 'JSON',
				data: {
					alias: alias
				}
			}).success(function(data) {
				dfd.resolve(data);
			}).error(function() {

			});

			return dfd.promise;
		}
	}]);
})();