(function() {
    var locationController = angular.module('location-controller', []);

    locationController.controller("LocationAdminController", ['$scope', function(scope) {
            scope.column_variable = [
                {
                    header: 'Location ID',
                    model: 'VVVLocationID',
                    search_type: 'text',
                },
                {
                    header: 'Location Name',
                    model: 'VVVLocationName',
                    search_type: 'text',
                },
                {
                    header: 'Latitude',
                    model: 'VVVLatitude',
                    search_type: 'text',
                },
                {
                    header: 'Longitude',
                    model: 'VVVLongitude',
                    search_type: 'text',
                },
                {
                    header: 'Popularity',
                    model: 'VVVPopularity',
                    search_type: 'text',
                },
                {
                    header: 'City',
                    model: 'VVVCity',
                    search_type: 'text',
                },
                {
                    header: 'State',
                    model: 'VVVStateName',
                    search_type: 'text',
                },
                {
                    header: 'Country',
                    model: 'VVVCountryName',
                    search_type: 'text',
                },
//        {
//            header: 'Created At',
//            model: 'VVVCreatedAt',
//            search_type: 'range_date',
//        },
//        {
//            header: 'Action',
//            model: 'LocationSpecificAction',
//            append: true,
//            content: '<div class="ui tiny button">Edit</div> <div class="ui tiny button">Delete</div>',
//        }
            ];
        }]);
})();