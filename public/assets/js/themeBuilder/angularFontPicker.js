var app = angular.module('angularFontPicker', ['angularDropdownList'])

app.directive('fontPicker', function($compile) {
	return {
		restrict: 'E',
		replace: false,
		template: function(element, attrs) {
		
			var name = attrs.name;
			var ngModel = attrs.ngModel;
			var ngChange = attrs.ngChange;
			var ngInit = attrs.ngInit;
			var ngModelName = ngModel;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(ngModel!=""&&ngModel!=null) ngModel = 'ng-model = "'+ngModel+'"'; else ngModel ='';
			if(ngChange!=""&&ngChange!=null) ngChange = 'ng-change = "'+ngChange+'"'; else ngChange ='';
			if(ngInit!=""&&ngInit!=null) ngInit = 'ng-init = "'+ngInit+'"'; else ngInit ='';
			
			var template = 
				'<div '+name+' '+ngModel+' '+ngChange+' '+ngInit+'>'+
				'	<div class="ui basic bottom small labeled icon fluid button font-picker-button">'+
				'		<div class="text">Select Font</div>'+
				'		<i class="black inverted font icon"></i>'+
				'	</div><div class="ui fluid font-picker-divider"></div>'+
				'	<div class="ui transition hidden box-shadow9 font-picker-details" style="position:absolute;">'+
				'		<font-family-picker value="{{fontFamilyValue}}"></font-family-picker><br>'+
				'		<div class = "3 fluid small ui icon buttons">'+
				'			<font-weight-selector class="fwselector"></font-weight-selector>'+
				'			<font-style-selector class="fsselector"></font-style-selector>'+
				'			<text-decoration-selector></text-decoration-selector>'+
				'		</div><br>'+
				'		<font-size-picker value="14px"></font-size-picker>'+
				'		<div class="2 fluid small ui buttons font-picker-commands">'+
				'		  <div class="ui red button cancel-button">Cancel</div>'+
				'		  <div class="or"></div>'+
				'		  <div class="ui green button apply-button">Apply</div>'+
				'		</div>'+
				'	</div>'+
				'</div>';
				
            return template;
        },
		require: '?ngModel',
        link:function($scope,element,attr,ngModel){
			//console.debug($scope);
			
			//var modifySelector = attr.modifySelector;
			
			var previewsValue = $scope.$eval(attr.ngModel);
			
			element.css("font",previewsValue);
			
			var fontWeightValue = element.css('font-weight');
			var fontStyleValue = element.css('font-style');
			var fontSizeValue = element.css('font-size');
			var fontFamilyValue = element.css('font-family');
			
			element.find('.fwselector').find('input').val(fontWeightValue);
			element.find('.fsselector').find('input').val(fontStyleValue);
			element.find('font-size-picker').find('input').val(fontSizeValue);
			element.find('font-family-picker').find('input').val(fontFamilyValue);
			
			console.log(fontWeightValue);
			console.log(fontStyleValue);
			console.log(fontSizeValue);
			console.log(fontFamilyValue);
			
			function getFormattedFontValue(){
				var formatedFontValue = '';
				
				if(element.find('.fwselector').find('input').val()=='bold') formatedFontValue += 'bold ';
				if(element.find('.fsselector').find('input').val()=='italic') formatedFontValue += 'italic ';
				
				formatedFontValue += element.find('font-size-picker').find('input').val()+' ';
				formatedFontValue += element.find('font-family-picker').find('input').val()+' ';
				
				return formatedFontValue;
			}
			
			element.find('input').bind('change', function () {
				ngModel.$setViewValue(getFormattedFontValue());
			});
			
			element.find('.apply-button').bind('click',function(){
				ngModel.$setViewValue(getFormattedFontValue());
				element.find('.font-picker-details').transition('slide down show');
			});
			
			element.find('.cancel-button').bind('click',function(){
				ngModel.$setViewValue(previewsValue);
				element.find('.font-picker-details').transition('slide down show');
			});
			
			element.find('.font-picker-button').bind('click',function(){
				var previewsValue = $scope.$eval(attr.ngModel);
				element.find('.font-picker-details').transition('slide down show');
			});
			
			
        }
      };
});

app.directive('fontFamilyPicker', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		compile: function(element, attrs) {
		
			var name = attrs.name;
			var ngModel = attrs.ngModel;
			var ngChange = attrs.ngChange;
			var ngInit = attrs.ngInit;
			var value = attrs.value;
			var ngModelName = ngModel;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(ngModel!=""&&ngModel!=null) ngModel = 'ng-model = "'+ngModel+'"'; else ngModel ='';
			if(ngChange!=""&&ngChange!=null) ngChange = 'ng-change = "'+ngChange+'"'; else ngChange ='';
			if(ngInit!=""&&ngInit!=null) ngInit = 'ng-init = "'+ngInit+'"'; else ngInit ='';
			if(value==""||value==null) value = 'Select Font';
			
			var template = 
				'<dropdown-list '+name+' '+ngModel+' '+ngChange+' '+ngInit+
				'	list="font in fonts"'+
				'	list-display="font.display"'+
				'	list-style="font-family:{{font.name}}; font-size:14px"'+
				'	list-custom-attributes=""'+
				'	list-value="font.name"'+
				'	dropdown-class="basic labeled icon top fluid selection pointing button"'+
				//'	dropdown-class="black icon top fluid selection pointing input small"'+
				'	dropdown-style="font-size:14px"'+
				'	dropdown-custom-attributes="ng-style = \'{fontFamily:'+ngModelName+'}\'"'+
				'	placeholder = "'+value+'"'+
				//'	dropdown-icon = "black inverted font"'+
				'	dropdown-icon = "black font"'+
				'></dropdown-list>';
            var input = angular.element(template);
            return function(scope, element, attrs) {
                element.append(input);
                var templateFn = $compile(input);
                templateFn(scope);
            }
        },
		controller: function($scope){
			$scope.fonts = [
				{name:"Georgia, serif", display:"Georgia"},
				{name:"'Palatino Linotype', 'Book Antiqua', Palatino, serif", display:"Palatino Linotype"},
				{name:"'Times New Roman', Times, serif", display:"Times New Roman"},
				{name:"Arial, Helvetica, sans-serif", display:"Arial"},
				{name:"'Arial Black', Gadget, sans-serif", display:"Arial Black"},
				{name:"'Comic Sans MS', cursive, sans-serif", display:"Comic Sans MS"},
				{name:"Impact, Charcoal, sans-serif", display:"Impact"},
				{name:"'Lucida Sans Unicode', 'Lucida Grande', sans-serif", display:"Lucida Sans Unicode"},
				{name:"Tahoma, Geneva, sans-serif", display:"Tahoma"},
				{name:"'Trebuchet MS', Helvetica, sans-serif", display:"Trebuchet MS"},
				{name:"Verdana, Geneva, sans-serif", display:"Verdana"},
				{name:"'Courier New', Courier, monospace", display:"Courier New"},
				{name:"'Lucida Console', Monaco, monospace", display:"Lucida Console"}	
			];
		},
        link:function($scope,elem,attr,ctrl){
			//console.debug($scope);
        }
      };
});

app.directive('fontSizePicker', function($compile) {
	return {
		restrict: 'E',
		replace: true,
		compile: function(element, attrs) {
		
			var name = attrs.name;
			var ngModel = attrs.ngModel;
			var ngChange = attrs.ngChange;
			var ngInit = attrs.ngInit;
			var ngModelName = ngModel;
			var value = attrs.value;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(ngModel!=""&&ngModel!=null) ngModel = 'ng-model = "'+ngModel+'"'; else ngModel ='';
			if(ngChange!=""&&ngChange!=null) ngChange = 'ng-change = "'+ngChange+'"'; else ngChange ='';
			if(ngInit!=""&&ngInit!=null) ngInit = 'ng-init = "'+ngInit+'"'; else ngInit ='';
			if(value!=""&&value!=null) value = 'value = "'+value+'"'; else value ='';
			
			var template = 
				'<slider '+name+' '+ngModel+' '+ngChange+' '+ngInit+' '+value+' min="10" max="30" step="2" prefix="" suffix="px"></slider>';
				
            var input = angular.element(template);
            return function(scope, element, attrs) {
                element.append(input);
                var templateFn = $compile(input);
                templateFn(scope);
            }
        },
        link:function($scope,elem,attr,ctrl){
			//console.debug($scope);
			
        }
      };
});

app.directive('fontWeightSelector', function() {
	return {
		template: function(element, attrs) {
		
			var name = attrs.name;
			var id = attrs.id;
			var value = attrs.value;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(id!=""&&id!=null) id = 'id = "'+id+'"'; else id ='';
			if(value!=""&&value!=null) value = 'value = "'+value+'"'; else value ='';
			
			var template = 
				'<div class="ui icon button">'+
				'	<input '+name+' '+id+' '+value+' type="hidden">'+
				'	<i class="bold icon"></i>'+
				'</div>';
				
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			//console.debug($scope);
			if(attr.value=='bold') element.addClass('active');
			
			element.bind('click', function(){
				if(element.hasClass('active')){
					element.removeClass('active');
					element.find('input').val('normal');
				}else{
					element.addClass('active');
					element.find('input').val('bold');
				}
				element.find('input').triggerHandler('change');
			});	
			
			if (!ngModel) return;
			
			if($scope.$eval(attr.ngModel)=='bold'&&!element.hasClass('active')) element.addClass('active');
			
			element.bind('click', function(){
				if(!element.hasClass('active')){
					$scope.$apply(function () {
					  ngModel.$setViewValue('normal');
					});
				}else{
					$scope.$apply(function () {
					  ngModel.$setViewValue('bold');
					});
				}
				
			});		
        }
    };
});

app.directive('fontStyleSelector', function() {
	return {
		template: function(element, attrs) {
		
			var name = attrs.name;
			var id = attrs.id;
			var value = attrs.value;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(id!=""&&id!=null) id = 'id = "'+id+'"'; else id ='';
			if(value!=""&&value!=null) value = 'value = "'+value+'"'; else value ='';
			
			var template = 
				'<div class="ui icon button">'+
				'	<input '+name+' '+id+' '+value+' type="hidden">'+
				'	<i class="italic icon"></i>'+
				'</div>';
				
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			//console.debug($scope);
			if(attr.value=='italic') element.addClass('active');
			
			element.bind('click', function(){
				if(element.hasClass('active')){
					element.removeClass('active');
					element.find('input').val('normal');
				}else{
					element.addClass('active');
					element.find('input').val('italic');
				}
				element.find('input').triggerHandler('change');
			});	
			
			if (!ngModel) return;
			
			if($scope.$eval(attr.ngModel)=='italic'&&!element.hasClass('active')) element.addClass('active');
			
			element.bind('click', function(){
				if(!element.hasClass('active')){
					$scope.$apply(function () {
					  ngModel.$setViewValue('normal');
					});
				}else{
					$scope.$apply(function () {
					  ngModel.$setViewValue('italic');
					});
				}
				
			});		
        }
    };
});

app.directive('textDecorationSelector', function() {
	return {
		template: function(element, attrs) {
		
			var name = attrs.name;
			var id = attrs.id;
			var value = attrs.value;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(id!=""&&id!=null) id = 'id = "'+id+'"'; else id ='';
			if(value!=""&&value!=null) value = 'value = "'+value+'"'; else value ='';
			
			var template = 
				'<div class="ui icon button">'+
				'	<input '+name+' '+id+' '+value+' type="hidden">'+
				'	<i class="underline icon"></i>'+
				'</div>';
				
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			//console.debug($scope);
			if(attr.value=='underline') element.addClass('active');
			
			element.bind('click', function(){
				if(element.hasClass('active')){
					element.removeClass('active');
					element.find('input').val('none');
				}else{
					element.addClass('active');
					element.find('input').val('underline');
				}
				element.find('input').triggerHandler('change');
			});	
			
			if (!ngModel) return;
			
			if($scope.$eval(attr.ngModel)=='underline'&&!element.hasClass('active')) element.addClass('active');
			
			element.bind('click', function(){
				if(!element.hasClass('active')){
					$scope.$apply(function () {
					  ngModel.$setViewValue('none');
					});
				}else{
					$scope.$apply(function () {
					  ngModel.$setViewValue('underline');
					});
				}
				
			});		
        }
    };
});

app.directive('slider', function() {
	return {
		template: function(element, attrs) {
		
			var name = attrs.name;
			var id = attrs.id;
			var value = attrs.value;
			
			if(name!=""&&name!=null) name = 'name = "'+name+'"'; else name ='';
			if(id!=""&&id!=null) id = 'id = "'+id+'"'; else id ='';
			if(value!=""&&value!=null) value = 'value = "'+value+'"'; else value ='';
			
			var template = 
				'<div style="color:#777777;font-size:12px;">'+
				'	<input '+name+' '+id+' '+value+' type="hidden">'+
				'	<div class = "ui fluid slider-value" style="text-align:center"></div>'+
				'	<div class = "angular-semantic-slider"></div>'+
				'	<div style="display:inline-block; width:100%">'+
				'		<div style="float:left">'+attrs.prefix+attrs.min+attrs.suffix+'</div>'+
				'		<div style="float:right">'+attrs.prefix+attrs.max+attrs.suffix+'</div>'+
				'	</div>'+
				'</div>';
				
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			//console.debug($scope);

			if (!ngModel){
				element.find('.slider-value').html(attr.value);
				
				element.find('.angular-semantic-slider').slider({
					value: parseInt(attr.value),
					min: parseInt(element.attr('min')),
					max: parseInt(element.attr('max')),
					step: parseInt(element.attr('step')),
					slide: function( event, ui ) {
						element.find('input').val(element.attr('prefix')+ui.value+element.attr('suffix'));
						element.find('.slider-value').html(ui.value);
						element.find('input').triggerHandler('change');
					}
				});	
			}else{
				ngModel.$render = function () {
					element.find('.slider-value').html(ngModel.$viewValue);
					
					element.find('.angular-semantic-slider').slider({
						value: parseInt(ngModel.$viewValue),
						min: parseInt(element.attr('min')),
						max: parseInt(element.attr('max')),
						step: parseInt(element.attr('step')),
						slide: function( event, ui ) {
							
							$scope.$apply(function () {
							  ngModel.$setViewValue(element.attr('prefix') + ui.value + element.attr('suffix'));
							  
							});
							element.find('input').val(ui.value);
							element.find('.slider-value').html(ui.value);
							element.find('input').triggerHandler('change');
							
						}
					});				
				};
			}
        }
      };
});
