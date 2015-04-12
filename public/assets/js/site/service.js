(function() {
    var siteService = angular.module('site-service', []);

    siteService.service('SiteService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
            this.getForm = function(companyID, siteID) {
                var dfd = q.defer();
                var urlToUse = '';
                
                if(siteID === null) {
                    urlToUse = rootScope.baseUrl + '/site/site-register/'+companyID;
                }else{
                    urlToUse = rootScope.baseUrl + '/site/site-register/'+companyID+'/'+siteID;
                }
                
                http({
                    url: urlToUse,
                    method: 'GET'
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
            
            this.registerSiteInformation = function(sInfo) {
                var dfd = q.defer();
                var siteInformation = JSON.stringify(sInfo);
                http({
                    url: rootScope.baseUrl + '/site/site-registration',
                    method: 'POST',
                    dataType: 'JSON',
                    data: siteInformation
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
            
            this.updateSiteInformation = function(sInfo) {
                var dfd = q.defer();
                var siteInformation = JSON.stringify(sInfo);
                http({
                    url: rootScope.baseUrl + '/site/edit-site-registration',
                    method: 'POST',
                    dataType: 'JSON',
                    data: siteInformation
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
        }]);
})();