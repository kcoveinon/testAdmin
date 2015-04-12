(function() {
    var stateController = angular.module('state-controller', []);

    stateController.controller("StateAdminController", ['$scope', function(scope) {
            scope.column_variable = [
                {
                    header: 'State ID',
                    model: 'VVVStateID',
                    search_type: 'text',
                    width: '14%'
                },
                {
                    header: 'State Name',
                    model: 'VVVStateName',
                    search_type: 'text',
                },
                {
                    header: 'State Code',
                    model: 'VVVStateCode',
                    search_type: 'text',
                    width: '14%'
                },
                {
                    header: 'Country',
                    model: 'VVVCountryName',
                    search_type: 'text',
                    width: '14%'
                },
                {
                    header: 'Action',
                    model: 'StateSpecificAction',
                    append: true,
                    content: '<div class="ui tiny button">Edit</div> <div class="ui tiny button">Delete</div>',
                    width: '14%'
                }
            ];
        }]);
})();