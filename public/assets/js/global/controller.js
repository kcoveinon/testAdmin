/************
 Global (parent) controller for vroom admin. 
 - All global tasks for vroom admin should be placed here.
 ************/

(function() {
    var vroomAdminApp = angular.module('global-controller', []);

    vroomAdminApp.controller("globalHeaderController", ['$scope', 'globalService', 'changeUserTypeService', function(scope, globalService, changeUserTypeService) {
        
        scope.showChangeUserTypeModal = changeUserTypeService.getContentByIndex('show');
        scope.changeUserTypeModalContent = changeUserTypeService.getContentByIndex('content');
        scope.changeUserTypeModalSettings = changeUserTypeService.getContentByIndex('settings');

    }]);


    vroomAdminApp.controller("VroomAdministrationController", ['$scope', 'globalService', 'PageDataService', function(scope, globalService, pageDataService) {

        scope.linkToShowAction = pageDataService.getLinkToShowAction();
        //scope.url = rootScope.baseUrl;
        scope.linkToShow = '';
        scope.setLinkToShow = function(newLink) {
            console.log('setting new link');
            scope.linkToShow = newLink;
        };

        //For Full Page Dimmer
        scope.showFullPageDimmer = false;
        scope.fullPageDimmerSettings = {
            closable: false
        }

        //For Contents
        scope.contentLink = globalService.getContentLink();
        //scope.contentLink = 'reconciliation/import-files'

        //For Change User Type Modal
        
        /*scope.showChangeUserTypeModal=false;
        scope.changeUserTypeModalContent={
            title:"Please select a partner you wish to login as",
            body:{
                link:"views/get/pages.global.changeUserTypeModalContent",
            },
            actions:{
                deny:{show:true,name:"Cancel",class:"orange positive"},
                approve:{show:true,name:"Accept",class:"blue negative"}                
            }
        };

        scope.changeUserTypeModalSettings={
            detachable: false,
            closable: false,
            onApprove: function() {

                var data = {
                    newCompanyID: scope.frmPartnerID
                };

                globalService.ajaxPostData('users/change-admin-session', data).then(function(response){
                    if(response.status === 'timeout'){
                        window.alert('Your session has expired. Please log in again.');
                        window.location.href = response.logoutURL;
                    }else{
                        window.location.reload();
                    }
                });
                
                // pageDataService.changeSession(scope.frmPartnerID).then(function(response) {
                //     if(response.status === 'timeout'){
                //         window.alert('Your session has expired. Please log in again.');
                //         window.location.href = response.logoutURL;
                //     }else{
                //         window.location.reload();
                //     }
                // });
                
            }
        }*/

        scope.companyList = [];

        globalService.ajaxGetData('company/all-companies-via-ajax').then(function(result){
            scope.companyList = result;
        });

        /*
        scope.url = rootScope.baseUrl;
        scope.setLinkToShow = function(newLink) {
            scope.linkToShow = newLink;
        };
        

        //For Change Session modal
        //scope.companyList = [];
        /*
        managePartnersService.getCompanies().then(function(result) {
            scope.companyList = result;
            //console.log(scope.companyList);
        });
        */
        scope.showPartnerModal = {
            status: false
        };
        
        scope.frmPartnerID = null;
    }]);
})();