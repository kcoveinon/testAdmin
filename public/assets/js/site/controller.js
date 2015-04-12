(function() {
    var siteController = angular.module('site-controller', []);

    siteController.controller("SiteAdminController", ['$scope', function(scope) {
            scope.siteFormParameters = {
                frmCompanyID: null,
                frmSiteID: null,
                frmPartnerName: '',
                frmPrefix: '',
                frmComment: ''
            };
        }]);
})();