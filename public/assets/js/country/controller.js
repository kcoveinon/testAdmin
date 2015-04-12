(function() {
    var countryController = angular.module('country-controller', []);

    countryController.controller("CountryAdminController", ['$scope', function(scope) {
            scope.column_variable = [
                {
                    header: 'Country ID',
                    model: 'VVVCountryID',
                    search_type: 'text',
                    width: '14%'
                },
                {
                    header: 'Country Name',
                    model: 'VVVCountryName',
                    search_type: 'text',
                },
                {
                    header: 'Country ISO Code',
                    model: 'VVVCountryISOCode',
                    search_type: 'text',
                    width: '14%'
                },
                {
                    header: 'Action',
                    model: 'CountrySpecificAction',
                    append: true,
                    content: '<div class="ui tiny button">Edit</div> <div class="ui tiny button">Delete</div>',
                    width: '14%'
                }
            ];
        }]);
})();