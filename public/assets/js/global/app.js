/************
 Global (parent) module declaration for vroom admin. 
 - All general configurations and modules should be placed here 
 ************/

(function() {

    /***************
     Note: For now, we should add all the modules in the vroomAdminApp.
     Example:
     var vroomAdminApp = angular.module('VroomAdministrationApp', [
     'ngSanitize',
     'vroomAdminController'
     'yourAddedModule'
     ]);
     ***************/

    var vroomAdminApp = angular.module('VroomAdministrationApp', [
        'ngSanitize'
        , 'global-controller'
        , 'global-directive'
        , 'global-service'
        , 'themeBuilder'
        //, 'grid-directive'
        , 'location-module'
        , 'depot-module'
        , 'country-module'
        , 'state-module'
        //, 'company-module'
        //, 'site-module'
        //, 'user-module'
        , 'manage-partners-module'
        //, 'directives-module'
        //, 'customModal'
        , 'plugins'
        , 'reconciliation-module'
    ]);

    vroomAdminApp.config(['$interpolateProvider', '$httpProvider', function(interpolateProvider, httpProvider) {
        interpolateProvider.startSymbol('[[').endSymbol(']]');
        httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    }]);

})();