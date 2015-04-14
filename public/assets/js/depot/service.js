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
    }]);

})();

