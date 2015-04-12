/********** ANGULAR SEMANTIC UI DROPDOWN LIST **********
 Description: 	AngularJS directive for Semantic UI dropdown list
 Version:		1.0
 Author:			Joef
 Date Started:	03/31/2014
 
 Tag:	dropdown-list
 
 Attributes:
 
 list
 - Required
 - A JSON or an ARRAY list that you want to fill up in the dropdown list
 
 list-display
 - Required
 - The field or variable that you want to be displayed in you list
 
 list-style
 - Optional
 - Personalize your list display by adding CSS attributes here
 - Same format as CSS
 
 list-value
 - Optional
 - The field or variable that you want to be the value of your field
 - By default this is equal to list-display
 
 dropdown-class
 - Optional
 - If you want to add some of "Semantic UI's" classes, you can put it here
 - Please see "Semantic UI's" website for more details
 
 dropdown-style
 - Optional
 - Personalize your selected data display by adding CSS attributes here
 - Same format as CSS 
 
 dropdown-icon
 - Optional
 - You can change your dropdown icon by specifying it here
 - Please see "Semantic UI's" website for more details
 
 dropdown-custom-attributes
 - Optional
 - Just in case you want to add other html or angularJS attributes, you can place it here
 
 placeholder
 - Optional
 - If no initial value, this will be shown by default
 
 Example:
 
 <dropdown-list
 list="rec in list"
 list-display="rec.name"
 ></dropdown-list>
 
 <dropdown-list
 ng-model = "users"
 ng-change = "selectedUser = users"
 ng-init = "users = 'Pedro'"
 
 list="rec in list"
 list-display="rec.name"
 list-style="font-size:14px"
 list-value="rec.id"
 dropdown-class="basic labeled icon top fluid selection pointing button big"
 dropdown-style="font-size:14px"
 dropdown-icon = "black inverted users"
 dropdown-custom-attributes="ng-click = doSomething()"
 placeholder = "Select Users"
 ></dropdown-list>';
 
 Requirements:
 
 semantic.css
 semantic.js
 angular.js
 
 Note:
 - This is still under development. I might change something from time to time so please please update your copy if there's a new version.
 - Right now, I manually handling versions since we don't have SVN or GIT for this one.
 
 
 ********************************************************/
(function() {
    var dropdownListDirective = angular.module('angularDropdownList', [])

    dropdownListDirective.directive('dropdownList', function($compile) {
        return {
            template: function(element, attrs) {

                var list = attrs.list;
                var listDisplay = attrs.listDisplay;
                var listStyle = attrs.listStyle
                var listValue = attrs.listValue;
                var dropdownClass = attrs.dropdownClass;
                var dropdownStyle = attrs.dropdownStyle;
                var dropdownIcon = attrs.dropdownIcon;
                var dropdownCustomAttributes = attrs.dropdownCustomAttributes;
                var placeholder = attrs.placeholder;

                var ngModelName = attrs.ngModel;

                var name = attrs.name;
                var id = attrs.id;

                if (listValue == "" || listValue == null)
                    listValue = listDisplay;
                if (dropdownClass == "" || dropdownClass == null)
                    dropdownClass = 'selection';
                if (placeholder == "" || placeholder == null)
                    placeholder = 'Select';
                if (dropdownIcon == "" || dropdownIcon == null)
                    dropdownIcon = 'dropdown';
                if (listStyle != "" && listStyle != null)
                    listStyle = 'style = "' + listStyle + '"';
                if (dropdownStyle != "" && dropdownStyle != null)
                    dropdownStyle = 'style = "' + dropdownStyle + '"';

                if (name != "" && name != null)
                    name = 'name = "' + name + '"';
                if (id != "" && id != null)
                    id = 'id = "' + id + '"';

                var listObjectName = listValue.substring(listValue.indexOf(".") + 1);

                var template =
                        '<div class="ui ' + dropdownClass + ' dropdown">' +
                        '	<input type="hidden" ' + name + ' ' + id + '>' +
                        '	<div class="default text" ng-if ="' + ngModelName + '!=null && ' + ngModelName + '!=\'\'" ng-repeat = "' + list + ' | filter:{' + listObjectName + ':' + ngModelName + '}" ' + dropdownStyle + ' ' + dropdownCustomAttributes + '">{{' + listDisplay + '}}</div>' +
                        '	<div class="default text" ng-if ="' + ngModelName + '==null || ' + ngModelName + '==\'\'" ' + dropdownStyle + ' ' + dropdownCustomAttributes + '">' + placeholder + '</div>' +
                        '	<i class="' + dropdownIcon + ' icon"></i>' +
                        '	<div class="menu">' +
                        '		<div class="item" ng-repeat = "' + list + '" data-value="{{' + listValue + '}}" ' + listStyle + '>{{' + listDisplay + '}}</div>' +
                        '</div>';

                return template;
            },
            restrict: 'E',
            replace: true,
            controller: function($scope) {

            },
            link: function($scope, elem, attr, ctrl) {
                //console.debug($scope);
                /*
                 if(attr.ngModel!=""&&attr.ngModel!=null){
                 elem.find('input').val($scope.$eval(attr.ngModel));
                 console.log('1');
                 }else if(attr.value!=""&&attr.value!=null){
                 elem.find('input').val(attr.value);
                 console.log(attr.value);
                 }else{
                 elem.find('input').val('Select');
                 console.log('test');
                 }
                 */
                elem.dropdown();
            }
        };
    });
    /*
    dropdownListDirective.directive('dropdown', function($timeout) {
        return {
            restrict: "C",
            require: '?ngModel',
            link: function(scope, elm, attr, ngModel) {
                $timeout(function() {
                    $(elm).dropdown().dropdown('setting', {
                        onChange: function(value) {
                            if (!ngModel)
                                return;
                            scope.$apply(function() {
                                ngModel.$setViewValue(value);
                            });
                        }
                    });
                }, 2000);
            }
        };
    });
    */
})();



