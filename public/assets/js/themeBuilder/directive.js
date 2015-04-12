/************
Theme Builder Directive.
 ************/

(function() {

    var themeBuilder = angular.module('themeBuilderDirective', [
    ]);

	themeBuilder.directive('pageListModal', ['ajaxCallService', function (ajaxCallService) {
		return {
			template: 
				'<div class="ui small modal">'+
				'	<div class="header">'+
				'		Select Page'+
				'	</div>'+
				'	<div class="content">'+
				'		<div class="ui divided list">'+
				'			<div class="item" ng-if="pageList.pageList == null">'+
				'				<div class="ui segment">'+
				'					<div class="ui active inverted dimmer">'+
				'						<div class="ui text loader">Loading</div>'+
				'					</div>'+
				'				</div>'+
				'			</div>'+
				'			<div class="item" ng-repeat="page in pageList.pageList">'+
				'				<div class="right floated tiny teal ui button" ng-click="pageSelect(page.pageFileName, page.scssFileName)">Select</div>'+
				'				<div class="content">'+
				'					<div class="header">[[page.pageName]]</div>'+
				'				</div>'+
				'			</div>'+
				'		</div>'+
				'	</div>'+
				'	<div class="actions">'+
				'		<div class="ui negative small button">'+
				'			Cancel'+
				'		</div>'+
				'	</div>'+
				'</div>',
			restrict: 'E',
			replace: true,
			
			link: function (scope, element, attrs) {
				scope.$watch('pageListActive', function(pageListActive) {
					if(pageListActive){
						setTimeout( function(){
							element.modal('setting', {
								closable  : false,
								onDeny    : function(){
									if(scope.pageSelected==''){
										alert('Please select a page first to continue.');
										return false;
									} else{
										scope.pageListActive = false;
										scope.$apply();
									}
								},
								onApprove : function() {
									//window.alert('Approved!');
									scope.pageListActive = false;
									scope.$apply();
								}
							})
							.modal('show')
							;
						}, 1000); //3 seconds
					}
					
				});
				
				scope.pageSelect = function(pageFileName, scssFileName){
				
					scope.pageSelected = pageFileName;
					scope.scssSelected = scssFileName;
					
					ajaxCallService.getJson('/theme-builder/scss-contents/'+siteID+'/'+pageFileName+'/'+scssFileName)
							.then(function(scssJson) {
								scope.scssString = scssJson['current'];
								scope.scssStringInit = scssJson['current'];
								scope.scssStringCurrent = scssJson['current'];
								scope.scssStringDefault = scssJson['default'];
								
								//console.log(scope.scssString);
							});
					
					scope.pageListActive = false;
					element.modal('hide');
				};
			
			}
		};
	}]);
	
	themeBuilder.directive('theConfigurator', ['$compile', function ($compile) {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, ele, attrs) {
				
				RegExp.prototype.execAll = function(string) {
					var matches = [];
					var match = null;
					while ( (match = this.exec(string)) != null ) {
						var matchArray = [];
						for (var i in match) {
							if (parseInt(i) == i) {
								matchArray.push(match[i]);
							}
						}
						matches.push(matchArray);
					}
					return matches;
				}
				
				scope.createFormObject = function(formObjectLabel, formObjectVariable, formObjectValue){
		
					formObjectLabel = '<label for="'+formObjectVariable+'">'+formObjectLabel+'</label>';
					formObjectContent = 'name="'+formObjectVariable+'" ng-model="'+formObjectVariable+'" ng-change="stylePreview(\''+formObjectVariable+'\', '+formObjectVariable+')" ng-init="'+formObjectVariable+'=\''+formObjectValue+'\'"';
					
					var prefix = formObjectVariable.substring(0, 8);
					var formObjectCode = '';
					
					switch(prefix)
					{
						case '$bgd_col':
								formObjectCode = '<color-picker '+formObjectContent+' include-opacity="y"></color-picker>';
							break;
						
						case '$bgd_img':
								formObjectCode = '<background-image-selector  '+formObjectContent+'></background-image-selector>';
							break;
							
						case '$fnt_fmy':
								formObjectCode = '<font-family-picker '+formObjectContent+'></font-family-picker>';
							break;
							
						case '$txt_col':
								formObjectCode = '<color-picker '+formObjectContent+'></color-picker>';
							break;
							
						case '$display':
								formObjectCode = '<display-toggle '+formObjectContent+'></display-toggle>';
							break;
						
						case '$fnt_gen':
								formObjectCode = '<font-picker  '+formObjectContent+'></font-picker>';
							break;
							
						case '$fnt_wgt':
								formObjectCode = '<font-weight-selector '+formObjectContent+'></font-weight-selector>';
							break;
						
						case '$fnt_sty':
								formObjectCode = '<font-style-selector '+formObjectContent+'></font-style-selector>';
							break;
						
						case '$fnt_dec':
								formObjectCode = '<text-decoration-selector '+formObjectContent+'></text-decoration-selector>';
							break;
							
						case '$fnt_sze':
								formObjectCode = '<font-size-picker  '+formObjectContent+'></font-size-picker>';
							break;
						
						default:
								formObjectCode = 'Under Developement';
					}
					
					return '<p >'+formObjectLabel+'<br>'+formObjectCode+'</p>';
				}
				
				scope.$watch('scssString', function(scssString) {
					
					if(scssString=='') return; 
					
					var scssInline = scssString.replace(/(\r\n|\n|\r)/gm,"");
					var scssVarsString = /\/\*--\[\[GENERATE:BEGIN\]\]--\*\/(.*?)\/\*--\[\[GENERATE:END\]\]--\*\//i.exec(scssInline);
					var regex = /\/\*--\[\[GROUP:(.*?):BEGIN\]\]--\*\/(.*?)\/\*--\[\[GROUP:END\]\]--\*\//g;
					
					var scssVarGroups = regex.execAll(scssVarsString[1]);
					
					var theConfiguratorForm = '<div class="ui basic fluid accordion" the-configurator-accordion>';
					
					angular.forEach(scssVarGroups, function(scssVarGroup){
						
						regex = /\/\*--\[\[OPEN:(.*?)\]\]--\*\//i;
						
						var openFunction = regex.exec(scssVarGroup[2]);
						scssVarGroup[2] = scssVarGroup[2].replace(regex,"");
						
						regex = /\/\*--\[\[CLOSE:(.*?)\]\]--\*\//i;
						
						var closeFunction = regex.exec(scssVarGroup[2]);
						scssVarGroup[2] = scssVarGroup[2].replace(regex,"");
						
						theConfiguratorForm += '<div class="title" ';
						
						if (openFunction!=null&&closeFunction!=null){
							theConfiguratorForm += 'onclick="if($(this).hasClass(\'active\')) document.getElementById(\'iframeStylePreview\').contentWindow.'+closeFunction[1]+'; else document.getElementById(\'iframeStylePreview\').contentWindow.'+openFunction[1]+';"';
						}
						
						theConfiguratorForm += '><i class="inverted list icon"></i>'+scssVarGroup[1]+'</div><div class="content">';
						
						var scssVars = /\/\*--\[\[(.*?)\]\]--\*\/(.*?):(.*?);/g.execAll(scssVarGroup[2]);
						
							angular.forEach(scssVars, function(scssVar){
								theConfiguratorForm += scope.createFormObject(scssVar[1], scssVar[2], scssVar[3]);
							});
						
						theConfiguratorForm += '</div>';

					});
					
					theConfiguratorForm += '</div><div class="spacingDiv"></div>';
					
					ele.html(theConfiguratorForm);
					$compile(ele.contents())(scope);
					//console.log(theConfiguratorForm);
				});
			
			}
		};
	}]);	
	
	themeBuilder.directive('mainWindow', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				scope.$watch('fullSize', function(fullSize) {
					//console.log(fullSize);
					if(!fullSize){
						element.animate({
							top: "75px",
						}, {
							duration: 200,
							queue: false,
						});
					}else{
						element.animate({
							top: "0px",
						}, {
							duration: 200,
							queue: false,
						});
					}
				});
			
			}
		};
		
	});
	
	themeBuilder.directive('resizeWindow', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					scope.fullSize = !scope.fullSize;
					scope.$apply();
				});
			
			}
		};
	});
	
	themeBuilder.directive('revertChanges', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					scope.scssString = scope.scssStringInit+' ';
					scope.scssStringCurrent = scope.scssString;
					scope.$apply();
				});
			
			}
		};
	});
	
	themeBuilder.directive('restoreDefault', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					scope.scssString = scope.scssStringDefault+' ';
					scope.scssStringCurrent = scope.scssString;
					scope.$apply();
				});
			
			}
		};
	});
	
	themeBuilder.directive('saveTheme', ['$http', '$rootScope', function (http, rootScope) {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					http.post(rootScope.baseUrl+'/theme-builder/save-changes', {'siteID': siteID, 'pageFileName': scope.pageSelected, 'scssFileName': scope.scssSelected, 'scss': scope.scssStringCurrent}).success(function(data) {
						if(data=='completed'){
							alert('Saving Complete');
						}else{
							alert('Problem encountered while uploading the image. Please try again later.');
						}
					});
				});
			
			}
		};
	}]);
	
	themeBuilder.directive('theConfiguratorAccordion', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.accordion();
			
			}
		};
	});
	
	themeBuilder.directive('pageSelect', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					scope.sideBarStatus = false;
					scope.pageListActive = true;
					scope.$apply();
				});
			
			}
		};
	});
	
	themeBuilder.directive('iframeStylePreview', ['$rootScope', function ($rootScope) {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				
				scope.$watch('pageSelected', function(pageSelected) {
					if(pageSelected!=''){
						//element.attr('src', $rootScope.baseUrl+'/theme-builder/style-preview/'+siteID+'/'+pageSelected);
						if(pageSelected=='resultPage'){
							console.log(pageSelected);
							element.attr('src', 'http://vroomvroomvroom.eu/theme-builder/vroomeu/2015-01-22/10:00/2015-01-24/10:00/1926/1926/AU/25+');
						}
						else{
							element.attr('src', $rootScope.baseUrl+'/theme-builder/style-preview/'+siteID+'/'+pageSelected);
						}
					}
				});
				
				element.load(function(){

					/*
					$(this).contents().mousemove(function(){
						clearTimeout(scope.mouseIdleListenerTimeout);
						
						if(!$('.hideOnMouseIdle').first().transition('is visible')) 
							$('.hideOnMouseIdle').transition({
								animation 	: 'fade in',
								duration  	: '150ms'
							});
						
						scope.mouseIdleListenerTimeout = setTimeout(function(){
							
							$('.hideOnMouseIdle').transition({
								animation 	: 'fade out',
								duration  	: '700ms'
							});
							
						}, 1500);
					});							
					*/
					//console.log(scope.scssStringCurrent);
					scope.applySCSS(scope.scssStringCurrent);

				});
				
			}
		};
	}]);

	
	themeBuilder.directive('sideBarToggle', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				element.click(function(){
					if(scope.sideBarStatus)
						scope.sideBarStatus=false;
					else
						scope.sideBarStatus=true;
					scope.$apply();
				});
			
			}
		};
	});
	
	themeBuilder.directive('sideBar', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				scope.$watch(attrs.sideBar, function(sideBarStatus) {
					if(sideBarStatus){
						
						element.animate({
							left: "0px",
						}, {
							duration: 300,
							queue: false,
						});						
						
					} else{
						
						element.animate({
							left: "-320px",
							
						}, {
							duration: 300,
							queue: false,
						});
						
					}
					
				});
			
			}
		};
	});
	
	themeBuilder.directive('tileButton', function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				
				var expandOnHover = !(scope.sideBarStatus);
				
				var expandTileButton = function(){
					element.animate({
						width: "230px",
						opacity: 0.9,
					}, {
						duration: 200,
						queue: false,
						complete: function(){
							$(this).find('span').show();
						},
					});
				};
				
				var collapseTileButton = function(){
					element.find('span').hide();
								
					element.animate({
						width: "70px",
						opacity: 0.65,
					}, {
						duration: 200,
						queue: false,
					});
				};
				
				scope.$watch('sideBarStatus', function(sideBarStatus) {
					if(sideBarStatus){
						expandOnHover = false;
						
						element.animate({
							left: "320px",
							
						}, {
							duration: 300,
							queue: false,
							complete: function(){
								expandTileButton();
							},
						});
						
					} else{
						element.animate({
							left: "0px",
							
						}, {
							duration: 300,
							queue: false,
							complete: function(){
								collapseTileButton();
								expandOnHover = true;
							},
						});		
						
						
						
					}
				});
				
				element.hover(function() {
					if(expandOnHover){
						expandTileButton();
					}
				}, function() {
					if(expandOnHover){
						element.stop();	
						collapseTileButton();
					}
				});
			
			}
		};
	});
	
	themeBuilder.directive('displayToggle', function() {
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
					'	<i class="hide icon"></i>'+
					'</div>';
					
				return template;
			},
			restrict: 'E',
			replace: true,
			require: '?ngModel',
			link: function($scope, element, attr, ngModel){
				//console.debug($scope);
				if(attr.value=='none'){
					element.find('i').removeClass('hide');
					element.find('i').addClass('unhide');				
				}
				
				element.bind('click', function(){			
					if(element.find('i').hasClass('hide')){
						element.find('i').removeClass('hide');
						element.find('i').addClass('unhide');
						element.find('input').val('none');
					}else{
						element.find('i').removeClass('unhide');
						element.find('i').addClass('hide');
						element.find('input').val('block');
					}
					element.find('input').triggerHandler('change');
				});	
				
				if (!ngModel) return;
				
				if($scope.$eval(attr.ngModel)=='none'&&!element.find('i').hasClass('unhide')) element.find('i').addClass('unhide');
				
				element.bind('click', function(){
					if(!element.find('i').hasClass('hide')){
						$scope.$apply(function () {
						  ngModel.$setViewValue('none');
						});
					}else{
						$scope.$apply(function () {
						  ngModel.$setViewValue('block');
						});
					}
					
				});		
			}
		};
	});
	
	themeBuilder.directive('googleAnalytics', [function () {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {

				var win = document.getElementById("iframeStylePreview").contentWindow;

				element.click(function(){
					

 					//console.log('1');

  					win.postMessage(

     					'Testing!!!!',

      					'http://localhost/vroomWeb_recode/public'

    				)

    				return false

					
				});
			
			}
		};
	}]);
	
})();