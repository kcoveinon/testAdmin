(function() {
    var userController = angular.module('user-controller', []);

    userController.controller("UserAdminController", ['$scope', function(scope) {
            scope.userFormParameters = {
                frmCompanyID: null,
                frmUserID: null,
                frmUsername: '',
                frmEmail: '',
                frmPassword: '',
                frmConfirmPassword: ''
            };
        }]);
})();