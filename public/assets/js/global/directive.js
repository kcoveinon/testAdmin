(function() {
    var globalDirective = angular.module('global-directive', []);

    globalDirective.directive('contentArea', ['$compile', 'globalService', function(compile, globalService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                scope.$watch(function(){ 
                        return globalService.getContentLink();
                    }, function(contentLink) {
                    if (contentLink != '') {
                        //console.log(contentLink);
                        scope.showFullPageDimmer = true;

                        globalService.ajaxGetData(contentLink).then(function(htmlContent){
                            element.html(htmlContent);
                            compile(element.contents())(scope);
                            scope.showFullPageDimmer = false;
                        });
                        
                    }
                });
            }
        };
    }]);

    globalDirective.directive('menuHover', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.dropdown({
                    on: 'hover'
                });

            }
        };
    }]);

    globalDirective.directive('menuAction', ['globalService', function(globalService) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                
                var action = attr.menuAction;
                var parameter = attr.menuActionParameter;

                element.click(function(){
                    switch(action){
                        case 'change-page':
                            //scope.contentLink = parameter;
                            globalService.setContentLink(parameter);
                            scope.$apply();
                            break;
                    }
                });
                
            }
        };
    }]);

    globalDirective.directive('changeUserType', ['$compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    scope.$apply(function() {
                        scope.showChangeUserTypeModal=true;
                    });
                });
            }
        };
    }]);

    globalDirective.directive('changePageDirective', ['$compile', 'PageDataService', function($compile, pageDataService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    scope.$watch('linkToShow', function(newVal, oldVal) {
                        console.log('Directive was called: ' + newVal);
                        if (newVal != '') {
                            pageDataService.showPageDimmer();
                            pageDataService.resetLinkToShowAction();
                            pageDataService.getPage(newVal).then(function(htmlns) {
                                $(".ui.dimmable.modal").remove();
                                elem.html(htmlns);
                                $compile(elem.contents())(scope);
                                pageDataService.hidePageDimmer();
                            });
                        }
                    }, true);
                }
            };
        }]);
    
    globalDirective.directive('manualChangePage', ['$compile', 'PageDataService', 'B2BModalService', 'globalService', function($compile, pageDataService, b2bModalService, globalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        //console.log('testing lang');
                        //$("#companyModal").modal('hide');
                        //var parent = scope.$parent.$parent.$parent.$parent.$parent.$parent;
                        //console.log(parent.contentLink);
                        // scope.$apply(function(){
                        //     //parent.contentLink = attrs.manualChangePage;
                        //     //globalService.setContentLink(attrs.manualChangePage);
                        // });
                    
                        // $(".ui.modal").modal('hide');
                        $("#mainModalID").modal('hide');

                        globalService.setContentLink(attrs.manualChangePage);
                        scope.$apply();
                        //parent.linkToShow = attrs.manualChangePage;
                        //console.log(parent.contentLink);
                        b2bModalService.setFirstModalParameters({
                            title: '',
                            action: '',
                            id: null
                        });
                        //$("#companyModal").modal('hide');
                    });
                }
            };
        }]);

    globalDirective.directive('changeSessionModal', ['$compile', 'PageDataService', function($compile, pageDataService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    scope.$watch('showPartnerModal.status', function(newVal, oldVal) {
                        if (newVal !== false){
                            elem.modal('setting', {
                                detachable: false,
                                closable: false,
                                onHide: function() {
                                    scope.showPartnerModal = {
                                        status: false
                                    };
                                },
                                onApprove: function() {
                                    pageDataService.changeSession(scope.frmPartnerID).then(function(response) {
                                        if(response.status === 'timeout'){
                                            window.alert('Your session has expired. Please log in again.');
                                            window.location.href = response.logoutURL;
                                        }else{
                                            window.location.reload();
                                        }
                                    });
                                }
                            }).modal('show');
                        }
                    }, true);
                }
            };
        }]);
    
    globalDirective.directive('sessionChange', ['$compile', 'PageDataService', function($compile, pageDataService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        pageDataService.changeSession(attrs.sessionChange).then(function(response) {
                            if(response.status === 'timeout'){
                                window.alert('Your session has expired. Please log in again.');
                                window.location.href = response.logoutURL;
                            }else{
                                window.location.reload();
                            }
                        });
                    });
                }
            };
        }]);























    /************************************* Previous Directives ***************************************/
    /* I'm currently changing some stuff in the directive. I'm using this previous codes as reference*/
    /*************************************************************************************************/

    globalDirective.directive('changePageDirective', ['$compile', 'PageDataService', function($compile, pageDataService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                scope.$watch('linkToShow', function(newVal, oldVal) {
                    console.log('Directive was called: ' + newVal);
                    if (newVal != '') {
                        pageDataService.showPageDimmer();
                        pageDataService.resetLinkToShowAction();
                        pageDataService.getPage(newVal).then(function(htmlns) {
                            $(".ui.dimmable.modal").remove();
                            elem.html(htmlns);
                            $compile(elem.contents())(scope);
                            pageDataService.hidePageDimmer();
                        });
                    }
                }, true);
            }
        };
    }]);
    /*
    globalDirective.directive('manualChangePage', ['$compile', 'PageDataService', 'B2BModalService', function($compile, pageDataService, b2bModalService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    var parent = scope.$parent.$parent.$parent.$parent.$parent.$parent.$parent;
                    $(".ui.modal").modal('hide');
                    parent.linkToShow = attrs.manualChangePage;
                    parent.$apply();
                    //$("#companyModal").modal('hide');
                });
            }
        };
    }]);
    */
    globalDirective.directive('changeSessionModal', ['$compile', 'PageDataService', function($compile, pageDataService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                scope.$watch('showPartnerModal.status', function(newVal, oldVal) {
                    if (newVal !== false){
                        elem.modal('setting', {
                            detachable: false,
                            closable: false,
                            onHide: function() {
                                scope.showPartnerModal = {
                                    status: false
                                };
                            },
                            onApprove: function() {
                                pageDataService.changeSession(scope.frmPartnerID).then(function(response) {
                                    if(response.status === 'timeout'){
                                        window.alert('Your session has expired. Please log in again.');
                                        window.location.href = response.logoutURL;
                                    }else{
                                        window.location.reload();
                                    }
                                });
                            }
                        }).modal('show');
                    }
                }, true);
            }
        };
    }]);
    
    globalDirective.directive('sessionChange', ['$compile', 'PageDataService', function($compile, pageDataService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    pageDataService.changeSession(attrs.sessionChange).then(function(response) {
                        if(response.status === 'timeout'){
                            window.alert('Your session has expired. Please log in again.');
                            window.location.href = response.logoutURL;
                        }else{
                            window.location.reload();
                        }
                    });
                });
            }
        };
    }]);
    
    globalDirective.directive('pageDimmerDirective', ['$compile', 'PageDataService', '$rootScope', function($compile, pageDataService, rootScope) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                rootScope.$watch('pageLoaderStatus', function(newVal, oldVal) {
                    if (newVal !== false){
                        elem.dimmer({
                            closable: false
                        }).dimmer('show');
                    }else{
                        elem.dimmer('hide');
                    }
                }, true);
            }
        };
    }]);

})();