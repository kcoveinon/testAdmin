(function() {
    var depotDirective = angular.module('depot-directive', []);

    depotDirective.directive('exportDepotButtonAction', function() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                
                elem.click(function() {
                    scope.modals.depotExport.show = true;
                    scope.$digest();
                });
            }
        };
    });

    depotDirective.directive('depotExportModalAction', ['SupplierService', function(supplierService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                scope.$watch('modals.depotExport.show', 
                    function(newVal, oldVal) {
                        if(newVal !== false) {
                            elem.modal('setting', {
                                detachable: false,
                                closable: false,
                                onHide: function() {
                                    scope.modals.depotExport.show = false;
                                    scope.$digest();

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
                $scope.supplierCollection = {
                    "EC" : {},
                    "HZ" : {},
                    "TH" : {},
                    "RS" : {},
                    "BG" : {},
                    "AV" : {},
                };
                supplierService.getSuppliers().then(function(data) {
                    $scope.supplier = data.response;
                    for(index in $scope.supplier) {
                        supplierInitial = $scope.supplier[index].supplierCode.toLowerCase();
                        if(typeof $scope.supplierCollection[supplierInitial.toUpperCase()] !== "undefined") {
                            $scope.supplierCollection[supplierInitial.toUpperCase()] = {
                                supplierName  : $scope.supplier[index].supplierName, 
                                supplierCode  : $scope.supplier[index].supplierCode.toLowerCase(),
                                supplierImage : 'http://www.vroomvroomvroom.com.au/book/images/icons/icon-' + $scope.supplier[index].supplierCode.toLowerCase() + '.gif',
                                isActive      : false,
                                isProcessing  : false
                            }
                        }
                    }
                });
            }
        };
    }]);

})();