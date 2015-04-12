(function() {
    var companyDirective = angular.module('company-directive', []);

    companyDirective.directive('newRecordClickAction', ['$compile', 'B2BModalService', function($compile, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        if (attrs.submodule === 'company') {
                            scope.$apply(function(){
                                b2bModalService.setFirstModalParameters({
                                    title: 'Add New Company',
                                    action: 'add',
                                    id: null
                                });
                                b2bModalService.setShowFirstModal({
                                    status: true
                                });
                            });
                        } else if (attrs.submodule === 'site') {
                            console.log('add new site was clicked');
                            scope.$apply(function(){
                                b2bModalService.setSecondModalParameters({
                                    title: 'Add New Site',
                                    action: 'add',
                                    companyID: scope.companyFormParameters.frmCompanyID,
                                    id: null
                                });
                                b2bModalService.setSelectedSubmodule({
                                    submodule: 'site'
                                });
                                b2bModalService.setShowSecondModal({
                                    status: true
                                });
                            });
                        } else if (attrs.submodule === 'user') {
                            scope.$apply(function(){
                                b2bModalService.setSecondModalParameters({
                                    title: 'Add New User',
                                    action: 'add',
                                    companyID: scope.companyFormParameters.frmCompanyID,
                                    id: null
                                });
                                b2bModalService.setSelectedSubmodule({
                                    submodule: 'user'
                                });
                                b2bModalService.setShowSecondModal({
                                    status: true
                                });
                            });
                        }
                    });
                }
            };
        }]);

    companyDirective.directive('editRecordClickAction', ['$compile', 'B2BModalService', function($compile, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        console.log('edit record directive was clicked.');
                        if (attrs.submodule === 'company') {
                            scope.$apply(function() {
                                b2bModalService.setFirstModalParameters({
                                    title: 'Edit Company',
                                    action: 'edit',
                                    id: attrs.submoduleIdentifier
                                });
                                b2bModalService.setShowFirstModal({
                                    status: true
                                });
                                //check, only the values of the first record is shown on the edit page.
                            });

                            console.log(b2bModalService.getFirstModalParameters());
                        } else if (attrs.submodule === 'site') {
                            scope.$apply(function(){
                                b2bModalService.setSecondModalParameters({
                                    title: 'Edit Site',
                                    action: 'edit',
                                    companyID: attrs.submoduleCompanyIdentifier,
                                    id: attrs.submoduleIdentifier
                                });
                                b2bModalService.setSelectedSubmodule({
                                    submodule: 'site'
                                });
                                b2bModalService.setShowSecondModal({
                                    status: true
                                });
                            });
                        } else if (attrs.submodule === 'user') {
                            scope.$apply(function(){
                                b2bModalService.setSecondModalParameters({
                                    title: 'Edit User',
                                    action: 'edit',
                                    companyID: attrs.submoduleCompanyIdentifier,
                                    id: attrs.submoduleIdentifier
                                });
                                b2bModalService.setSelectedSubmodule({
                                    submodule: 'user'
                                });
                                b2bModalService.setShowSecondModal({
                                    status: true
                                });
                            });
                        }
                    });
                }
            };
        }]);

    companyDirective.directive('firstModal', ['$compile', 'CompanyService', 'B2BModalService', function($compile, companyService, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    
                    elem.modal({
                        closable: false,
                        /*detachable: false,*/
                        allowMultiple: true,
                        onShow: function() {
                            console.log(b2bModalService.getFirstModalParameters());
                            if(b2bModalService.getFirstModalParameters().action === 'edit'){
                                $('#companyModal').css('margin-top', '-23%');
                                $('#companyModal').css('margin-left', '-38%');
                            }
                        },
                        onHide: function() {
                            console.log('onHide');
                            scope.$apply(function(){
                                b2bModalService.setFirstModalParameters({
                                    title: '',
                                    action: '',
                                    id: null
                                });
                                b2bModalService.setShowFirstModal({
                                    status: false
                                });

                                //maybe should clear the scope.companyFormParameters variable too?
                            });

                            console.log(b2bModalService.getFirstModalParameters());
                        }
                    });
                    
                    var unbindWatcher = scope.$watch('showFirstModal.status', function(newVal, oldVal) {
                        console.log('First Modal Directive Status: ' + newVal);
                        if (newVal !== false) {
                            companyService.getForm(scope.firstModalParameters.id).then(function(htmlns) {
                                elem.find('.content').html(htmlns);
                                $compile(elem.find('.content').contents())(scope);
                                elem.modal('show');
                            });
                            unbindWatcher();
                        }
                    }, true);

                    console.log(unbindWatcher);
                }
            };
        }]);

    companyDirective.directive('secondModal', ['$compile', 'SiteService', 'B2BModalService', 'UserService', function($compile, siteService, b2bModalService, userService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    
                    elem.modal('setting', {
                        closable: false,
                        /*detachable: false,*/
                        allowMultiple: true,
                        onShow: function() {
                            //adding a second dimmer and making sure that the second dimmer and modal shows above the first modal.
                            $('<div class="ui second dimmer page visible active" style="z-index: 1102;"></div>').insertBefore($(this));
                            $(this).css('z-index', '1103');
                        },
                        onHide: function() {
                            scope.$apply(function() {
                                b2bModalService.setSecondModalParameters({
                                    title: '',
                                    action: '',
                                    companyID: null,
                                    id: null
                                });
                                //remove second dimmer
                                $('.second.dimmer').remove();
                                b2bModalService.setShowSecondModal({
                                    status: false
                                });

                                //maybe should clear site form variable?
                            });
                        }
                    });
                    
                    scope.$watch('showSecondModal.status', function(newVal, oldVal) {
                        console.log('Second Modal Directive Status: ' + newVal);
                        if (newVal !== false) {
                            var submodule = b2bModalService.getSelectedSubmodule();
                            if (submodule.submodule === 'site') {
                                console.log('im here');
                                siteService.getForm(scope.secondModalParameters.companyID, scope.secondModalParameters.id).then(function(htmlns) {
                                    elem.find('.content').html(htmlns);
                                    $compile(elem.find('.content').contents())(scope);
                                    elem.modal('show');
                                });
                            }else{
                                userService.getForm(scope.secondModalParameters.companyID, scope.secondModalParameters.id).then(function(htmlns) {
                                    elem.find('.content').html(htmlns);
                                    $compile(elem.find('.content').contents())(scope);
                                    elem.modal('show');
                                });
                            }
                        }
                    }, true);
                }
            };
        }]);

    companyDirective.directive('addCompanyAction', ['$compile', 'CompanyService', 'B2BModalService', function($compile, companyService, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        companyService.registerCompanyInformation(scope.companyFormParameters).then(function(response) {
                            console.log(response);
                            if (response.status === 'failed') {
                                console.log(response.data);
                            } else if (response.status === 'error') {
                                console.log(response);
                            } else {
                                window.alert(response.message);
                                scope.$apply(function(){
                                    b2bModalService.setFirstModalParameters({
                                        title: '',
                                        action: '',
                                        id: null
                                    });
                                    b2bModalService.setShowFirstModal({
                                        status: false
                                    });
                                });
                            }
                        });
                    });
                }
            };
        }]);

    companyDirective.directive('editCompanyAction', ['$compile', 'B2BModalService', 'CompanyService', function($compile, b2bModalService, companyService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        companyService.updateCompanyInformation(scope.companyFormParameters).then(function(response) {
                            if (response.status === 'failed') {
                                console.log(response.data);
                            }else if (response.status === 'error') {
                                console.log(response);
                            }else {
                                window.alert(response.message);
                                scope.$apply(function(){
                                    b2bModalService.setFirstModalParameters({
                                        title: '',
                                        action: '',
                                        id: null
                                    });
                                    b2bModalService.setShowFirstModal({
                                        status: false
                                    });
                                });
                            };
                        });
                    });
                }
            };
        }]);

    companyDirective.directive('companyTabAction', ['$compile', 'B2BModalService', 'CompanyService', function($compile, b2bModalService, companyService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    elem.click(function() {
                        elem.addClass('active');
                        elem.siblings().removeClass('active');
                        if(attrs.id === 'siteTab') {
                            $('#siteTabContent').addClass('active');
                            $('#userTabContent').removeClass('active');
                        } else if(attrs.id === 'userTab') {
                            $('#siteTabContent').removeClass('active');
                            $('#userTabContent').addClass('active');
                        }
                    });
                }
            };
        }]);
    
//    companyDirective.directive('companyThemeBuilderAction', ['$compile', 'PageDataService', 'CompanyService', function($compile, pageDataService, companyService) {
//            return {
//                restrict: 'A',
//                link: function(scope, elem, attrs) {
//                    elem.click(function() {
//                        pageDataService.get
//                    });
//                }
//            };
//        }]);
})();