(function() {
    var depotService = angular.module('depot-service', []);


    depotService.service('SupplierService', ['$http', '$q','$rootScope', function(http, q, rootScope) {

        this.getSuppliers = function() {
            var dfd = q.defer();

            http({              
                url: rootScope.baseUrl + '/supplier/get',
                method: 'GET',
                dataType: 'JSON'
            }).success(function(data) {
                dfd.resolve(data);
            }).error(function(data) {
                
            });

            return dfd.promise;
        }

        this.updateDepots = function(code) {
            var dfd = q.defer();
            http(
                {
                    "url"    : 'http://vroom.hertz.local/'+ code.toUpperCase() +'/depots/update-records?callback=JSON_CALLBACK',
                    "method" : "jsonp",
                }
            ).success(function(response) {
                dfd.resolve(response);
            }).error(function(response) {

            });
            return dfd.promise;
        }
    }]);

})();

