(function() {
    var companyController = angular.module('company-controller', []);

    companyController.controller("CompanyAdminController", ['$scope', 'B2BModalService', function(scope, b2bModalService) {

            scope.showFirstModal = b2bModalService.getShowFirstModal();
            scope.showSecondModal = b2bModalService.getShowSecondModal();

            scope.firstModalParameters = b2bModalService.getFirstModalParameters();
            scope.secondModalParameters = b2bModalService.getSecondModalParameters();
            
            scope.selectedSubmoduleToShowOnModal = b2bModalService.getSelectedSubmodule();

            scope.companyFormParameters = {
                frmCompanyID: '',
                frmCompanyName: '',
                frm: ''
            };
            
            scope.column_variable = [
                {
                    header: 'Company ID',
                    model: 'VVVCompanyID',
                    search_type: 'text',
                    width: '10%'
                },
                {
                    header: 'Company Name',
                    model: 'VVVCompanyName',
                    search_type: 'text',
                    width: '13%'
                },
                {
                    header: 'Site ID',
                    model: 'VVVSiteID',
                    search_type: 'text',
                    width: '10%'
                },
                {
                    header: 'Site Name',
                    model: 'VVVSiteName',
                    search_type: 'text'
                },
                {
                    header: 'Site GUID',
                    model: 'VVVSiteGUID',
                    search_type: 'text'
                },
                {
                    header: 'Site Created At',
                    model: 'VVVSiteCreatedAt',
                    search_type: 'range_date',
                    width: '13%'
                },
                {
                    header: 'Action',
                    model: 'CompanySpecificAction',
                    append: true,
                    content: '<div class="ui tiny button" edit-record-click-action submodule="company" submodule-identifier="[[row.VVVCompanyID]]">Edit</div> <div class="ui tiny button">Delete</div>',
                    width: '14%'
                }
            ];

            scope.user_table_columns = [
//        {
//            header: 'User ID',
//            model: 'AUserID',
//            search_type: 'text',
//            width: '17%'
//        },
                {
                    header: 'Username',
                    model: 'AName',
                    search_type: 'text',
                    width: '20%'
                },
                {
                    header: 'Email Address',
                    model: 'AEmail',
                    search_type: 'text'
                },
                {
                    header: 'Created At',
                    model: 'ACreatedAt',
                    search_type: 'range_date',
                    width: '20%'
                },
                {
                    header: 'Action',
                    model: 'UserDataSpecificAction',
                    append: true,
                    content: '<div class="ui tiny button" edit-record-click-action submodule="user" submodule-company-identifier="[[row.ACompanyID]]" submodule-identifier="[[row.AUserID]]">Edit</div> <div class="ui tiny button">Delete</div>',
                    width: '20%'
                }
            ];

            scope.site_table_columns = [
//        {
//            header: 'SiteID',
//            model: 'VVVSiteID',
//            search_type: 'text',
//            width: '25%'
//        },
                {
                    header: 'Site Name',
                    model: 'VVVSiteName',
                    search_type: 'text',
                    width: '25%'
                },
                {
                    header: 'Site GUID',
                    model: 'VVVSiteGUID',
                    search_type: 'range_date'
                },
                {
                    header: 'Action',
                    model: 'SiteDataSpecificAction',
                    append: true,
                    content: '<div class="ui tiny button" manual-change-page="theme-builder/index/[[row.VVVSiteID]]">Theme Builder</div> <div class="ui tiny button" edit-record-click-action submodule="site" submodule-company-identifier="[[row.VVVCompanyID]]" submodule-identifier="[[row.VVVSiteID]]">Edit</div> <div class="ui tiny button">Delete</div>',
                    width: '35%'
                }
            ];

        }]);
})();