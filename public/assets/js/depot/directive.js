(function() {
    var depotDirective = angular.module('depot-directive', []);

    depotDirective.directive('exportDepotButtonAction', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    scope.modals.depotExport.show = true;
                    scope.$apply();
                });
            }
        };
    });

    depotDirective.directive('depotExportModalAction', ['SupplierService', function(supplierService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                scope.$watch(
                    function() {
                        return scope.modals.depotExport.show;
                    }, 
                    function(newVal, oldVal) {
                        if (newVal !== false) {
                            elem.modal('setting', {
                                detachable: false,
                                closable: false,
                                onHide: function() {
                                    scope.modals.depotExport.show = false;
                                    scope.$apply();

                                    return false;
                                },
                                onApprove: function() {

                                    return false;
                                }
                            }).modal('show');
                        }
                    });
            },
            controller: function($scope) {
                $scope.supplierCollection = {};

                supplierService.getSuppliers().then(function(data) {
                    $scope.supplier = data.response;

                    for (index in $scope.supplier) {
                        supplierCode = $scope.supplier[index].supplierCode.toLowerCase();
                        $scope.supplierCollection[supplierCode.toUpperCase()] = {
                            supplierName  : $scope.supplier[index].supplierName, 
                            supplierCode  : $scope.supplier[index].supplierCode.toLowerCase(),
                            supplierImage : 'http://www.vroomvroomvroom.com.au/book/images/icons/icon-' + $scope.supplier[index].supplierCode.toLowerCase() + '.gif',
                            isActive      : false,
                            isProcessing  : false
                        }
                    }
                });
            }
        };
    }]);

})();