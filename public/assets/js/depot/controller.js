(function() {
    var depotController = angular.module('depot-controller', []);

    depotController.controller("DepotAdminController", ['$scope', 'SupplierService', function(scope, supplierService) {

            scope.doUpdateDepots = function() {

                for (i in scope.supplierCollection) {
                    if (scope.supplierCollection[i].isActive === true && scope.supplierCollection[i].isProcessing === false) {
                        var params = scope.supplierCollection[i].supplierCode;
                        scope.supplierCollection[i].isProcessing = true;
                        supplierService.updateDepots(params).then(function(response, i) {
                            var supplierCode = response.supplierCode;
                            scope.supplierCollection[supplierCode].isProcessing = false;
                        });
                    }
                }
                console.log(scope.supplierCollection);
            }

            scope.modals = {
                depotExport: {
                    show: false,
                    isTransacting: false
                }
            };

            scope.column_variable = [
                {
                    header: 'Depot ID',
                    model: 'VVVDepotID',
                    search_type: 'text',
                    width: '10%'
                },
                {
                    header: 'Supplier Name',
                    model: 'VVVSupplierName',
                    search_type: 'text',
                    width: '10%'
                },
                {
                    header: 'Depot Name',
                    model: 'VVVDepotName',
                    search_type: 'text',
                },
                {
                    header: 'Depot Code',
                    model: 'VVVDepotCode',
                    search_type: 'text',
                    width: '10%'
                },
//        {
//            header: 'Is Airport',
//            model: 'VVVAirport',
//            search_type: 'text',
//            width: '10%'
//        },
                {
                    header: 'Phone Number',
                    model: 'VVVDepotPhone',
                    search_type: 'text',
                    width: '10%'
                },
                {
                    header: 'Address',
                    model: 'VVVDepotAddress',
                    search_type: 'text',
                },
                {
                    header: 'City',
                    model: 'VVVDepotCity',
                    search_type: 'text',
                },
                {
                    header: 'Post Code',
                    model: 'VVVPostCode',
                    search_type: 'text',
                    width: '10%'
                },
//        {
//            header: 'Latitude',
//            model: 'VVVLatitude',
//            search_type: 'text',
//        },
//        {
//            header: 'Longitude',
//            model: 'VVVLongitude',
//            search_type: 'text',
//        },
//        {
//            header: 'Popularity',
//            model: 'VVVDepotPopoularity',
//            search_type: 'text',
//        },
                {
                    header: 'Country Name',
                    model: 'VVVCountryName',
                    search_type: 'text',
                    width: '10%'
                },
//        {
//            header: 'Action',
//            model: 'LocationSpecificAction',
//            append: true,
//            content: '<div class="ui tiny button">Edit</div> <div class="ui tiny button">Delete</div>',
//        }
            ];
        }]);
})();