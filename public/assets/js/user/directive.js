(function() {
    var userDirective = angular.module('user-directive', []);
    
    userDirective.directive('addUserAction', ['$compile', 'UserService', 'B2BModalService', function($compile, userService, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        userService.registerUserInformation(scope.userFormParameters).then(function(response) {
                            console.log(response);
                            if (response.status === 'failed') {
                                console.log(response.data);
                            } else if (response.status === 'error') {
                                console.log(response);
                            } else {
                                window.alert(response.message);
                                scope.$apply(function(){
                                    b2bModalService.resetSecondModalParameters();
                                    b2bModalService.setShowSecondModal({
                                        status: false
                                    });
                                });
                            }
                        });
                    });
                }
            };
        }]);
    
    userDirective.directive('editUserAction', ['$compile', 'B2BModalService', 'UserService', function($compile, b2bModalService, userService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        userService.updateUserInformation(scope.userFormParameters).then(function(response) {
                            if (response.status === 'failed') {
                                console.log(response.data);
                            }else if (response.status === 'error') {
                                console.log(response);
                            }else {
                                window.alert(response.message);
                                scope.$apply(function(){
                                    b2bModalService.resetSecondModalParameters();
                                    b2bModalService.setShowSecondModal({
                                        status: false
                                    });
                                });
                            };
                        });
                    });
                }
            };
        }]);
})();