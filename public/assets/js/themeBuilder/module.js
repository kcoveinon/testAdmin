/************
Theme builder module declaration. 
 - All general configurations and modules for theme builder should be placed here 
 ************/

(function() {

    var themeBuilder = angular.module('themeBuilder', [
        'themeBuilderController'
        ,'themeBuilderDirective'
        ,'themeBuilderService'
		,'angularColorPicker'
		,'angularFontPicker'
		,'angularBackgroundSelector'
		,'htmlBuilderModule'
    ]);

})();