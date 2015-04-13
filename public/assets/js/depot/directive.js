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

    depotDirective.directive('depotExportModalAction', function() {
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
                                },
                            }).modal('show');
                        }

                    });
            }
        };
    });

})();