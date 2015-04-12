(function() {
    var userService = angular.module('user-service', []);

    userService.service('UserService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
            this.getForm = function(companyID, siteID) {
                var dfd = q.defer();
                var urlToUse = '';
                
                if(siteID === null) {
                    urlToUse = rootScope.baseUrl + '/user/user-register/'+companyID;
                }else{
                    urlToUse = rootScope.baseUrl + '/user/user-register/'+companyID+'/'+siteID;
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
            
            this.registerUserInformation = function(sInfo) {
                var dfd = q.defer();
                var siteInformation = JSON.stringify(sInfo);
                http({
                    url: rootScope.baseUrl + '/user/user-registration',
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
            
            this.updateUserInformation = function(sInfo) {
                var dfd = q.defer();
                var siteInformation = JSON.stringify(sInfo);
                http({
                    url: rootScope.baseUrl + '/user/edit-user-registration',
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