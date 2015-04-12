(function() {
    var siteDirective = angular.module('site-directive', []);
    
    siteDirective.directive('addSiteAction', ['$compile', 'SiteService', 'B2BModalService', function($compile, siteService, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        siteService.registerSiteInformation(scope.siteFormParameters).then(function(response) {
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
    
    siteDirective.directive('editSiteAction', ['$compile', 'B2BModalService', 'SiteService', function($compile, b2bModalService, siteService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        siteService.updateSiteInformation(scope.siteFormParameters).then(function(response) {
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