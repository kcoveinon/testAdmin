(function() {
    var managePartnersDirective = angular.module('manage-partners-directive', []);

    managePartnersDirective.directive('companyAction', ['$compile', 'B2BModalService', 'managePartnersService', function(compile, b2bModalService, managePartnersService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function() {
                    
                    companyId = attrs.companyId;
                    companyAction = attrs.companyAction;

                    switch(companyAction){
                        case 'edit':
                            scope.$apply(function(){
                                b2bModalService.setMainModalSettings({
                                    show:true,
                                    title:"Edit Company",
                                    body:{
                                        link:"manage-partners/company-register/"+companyId,
                                    },
                                    actions:{
                                        close:{show:true,name:"Close",class:"red small"},
                                        custom:[
                                            {name:"Update Company",command:"company-action='update' company-id="+companyId,class:"blue small"}
                                        ]
                                    }
                                });
                            });
                            break;

                        case 'update':
                            alert('Update Complete!');

                            break;
                            /*
                            managePartnersService.updateCompanyInformation(scope.companyFormParameters).then(function(response) {
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
                            */
                    }
                });
            }
        };
    }]);

    managePartnersDirective.directive('siteAction', ['$compile', 'B2BModalService', 'managePartnersService', function(compile, b2bModalService, managePartnersService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function() {
                    
                    siteAction = attrs.siteAction;
                    siteId = attrs.siteId;
                    companyId = attrs.companyId;

                    switch(siteAction){
                        case 'edit':
                            scope.$apply(function(){
                                b2bModalService.setSubModalSettings({
                                    show:true,
                                    title:"Edit Site",
                                    contentLink:"manage-partners/site-register/"+companyId+"/"+siteId,
                                    actions:{
                                        close:{show:true,name:"Close",class:"red small"},
                                        custom:[
                                            {name:"Update Site",command:"site-action='edit' company-id="+companyId+" site-id="+siteId,class:"blue small"}
                                        ]
                                    }
                                });
                            });
                            break;

                        case 'update':
                            alert('Update Complete!');

                            break;

                    }
                });
            }
        };
    }]);
    
    /*managePartnersDirective.directive('testingLang', ['$compile', 'B2BModalService', function(compile, b2bModalService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.click(function() {
                    console.log('testing');
                    alert('testing');
                });
                
            }
        };
    }]);*/

    managePartnersDirective.directive('newRecordClickAction', ['$compile', 'B2BModalService', function($compile, b2bModalService) {
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

    managePartnersDirective.directive('editRecordClickAction', ['$compile', 'B2BModalService', function($compile, b2bModalService) {
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
    /*
    managePartnersDirective.directive('firstModal', ['$compile', 'managePartnersService', 'B2BModalService', function($compile, managePartnersService, b2bModalService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    
                    elem.modal({
                        closable: false,
                        detachable: false,
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
                            managePartnersService.getForm(scope.firstModalParameters.id).then(function(htmlns) {
                                elem.find('.content').html(htmlns);
                                $compile(elem.find('.content').contents())(scope);
                                elem.modal('show');
                            });
                            unbindWatcher();
                        }
                    }, true);

                }
            };
        }]);

    managePartnersDirective.directive('secondModal', ['$compile', 'SiteService', 'B2BModalService', 'UserService', function($compile, siteService, b2bModalService, userService) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    
                    elem.modal('setting', {
                        closable: false,
                        detachable: false,
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
    */
    managePartnersDirective.directive('addCompanyAction', ['$compile', 'managePartnersService', 'B2BModalService', function($compile, managePartnersService, b2bModalService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    managePartnersService.registerCompanyInformation(scope.companyFormParameters).then(function(response) {
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

    managePartnersDirective.directive('editCompanyAction', ['$compile', 'B2BModalService', 'managePartnersService', function($compile, b2bModalService, managePartnersService) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.click(function() {
                    managePartnersService.updateCompanyInformation(scope.companyFormParameters).then(function(response) {
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

    managePartnersDirective.directive('companyTabAction', ['$compile', 'B2BModalService', 'managePartnersService', function($compile, b2bModalService, managePartnersService) {
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
    
//    managePartnersDirective.directive('companyThemeBuilderAction', ['$compile', 'PageDataService', 'managePartnersService', function($compile, pageDataService, managePartnersService) {
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