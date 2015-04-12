

(function() {

    var htmlBuilder = angular.module('htmlBuilderModule', ['angularBackgroundSelector']);

    htmlBuilder.directive('htmlBuilder', function ($compile) {
		return {
		    restrict: 'A',
		    scope:{
		    	currentHtml:'=',
		    	currentHtmlType:'=',
		    	htmlType:'@',
		    	showModal:'='
		    },
		    replace: true,
		    link: function (scope, ele, attrs) {

				ele.addClass('html-builder-banner');
				
				ele.hover(
					function() {
						ele.append('<div class="html-builder-banner-highlight" ></div>');
						ele.find('.html-builder-banner-highlight').css('height',ele.height());
						ele.find('.html-builder-banner-highlight').css('top',ele.position().top);
					}, function() {
						ele.find('.html-builder-banner-highlight').remove();
					}
				);		
				
				ele.click(
					function() {
						scope.currentHtmlType = scope.htmlType
						scope.showModal = true;
						scope.$apply();
					}
				);
				
				scope.$watch('currentHtml', function(currentHtml) {
					if(currentHtml!="" && scope.currentHtmlType == scope.htmlType){
						ele.html(currentHtml);
						$compile(ele.contents())(scope);
						
					}
					
				});
			}
	  	};
	});

	htmlBuilder.directive('htmlBuilderModal', ['ajaxCallService', '$http', '$timeout', function(ajaxCallService, http, timeout) {
		return {
			template: 
				'<div class="ui modal">'+
				'	<div class="header">'+
				'		[[title]]'+
				'		<div class="ui right floated" style="display:block;width:230px;float:right;">'+
				'			<background-image-selector ng-model="imageUploads" ng-init="imageUploads=\'url()\'"></background-image-selector>'+
				'		</div>'+
				'		<div class="ui right floated" style="display:block;width:250px;float:right;margin-right:5px;">'+
				'			<div class="ui fluid input" style="font-size:14px;"><input type="text" ng-model="imageUploads"></div>'+
				'		</div>'+
				'	</div>'+				
				'	<div class="content">'+
				'		<div class="ui divided list">'+
//				'			<div modal-page-type="select" modal-page-listener="[[modalPage]]" >'+
				'			<div ng-show="modalPage==\'select\'">'+
				'				<div class="item" ng-show="htmlList == null">'+
				'					<div class="ui active inverted dimmer">'+
				'						<div class="ui text loader">Loading</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="item" ng-repeat="html in htmlList">'+
				'					<div class="right floated mini teal ui button" ng-click="htmlSelect(html.htmlCode, html.htmlSourceType)">Select [[htmlTypeDisplay]]</div>'+
				'					<div class="right floated mini teal ui button" ng-click="editHtml(html.htmlCode, html.htmlSourceType, html.htmlName)">Edit [[htmlTypeDisplay]]</div>'+
				'					<div class="content">'+
				'						<div class="header" style="font-size:14px;">[[html.htmlName]]</div>'+
				'					</div>'+
				'				</div>'+
				'				<div class="item" ng-show="htmlList != null">'+
				'					<div class="right floated mini green ui button" ng-click="createHtml()">Create [[htmlTypeDisplay]]</div>'+
				'					<div class="right floated mini green ui button" ng-click="editGoogleAnalytics()">Edit Google Analytics</div>'+
				'				</div>'+
				'			</div>'+
//				'			<div modal-page-type="create" modal-page-listener="[[modalPage]]">'+
				'			<div ng-show="modalPage==\'create\' || modalPage==\'edit\' || modalPage==\'googleAnalytics\'">'+
				'				<div ng-hide="modalPage==\'googleAnalytics\'" class="ui fluid input">'+
				'					<span>[[htmlTypeDisplay]] name: </span>'+
				'					<input ng-model="customHtmlCode" style="display:none;">'+
				'					<input ng-model="customHtmlName" type="text" placeholder="Input [[htmlTypeDisplay]] Name">'+
				'				</div><br>'+
				'				<div id="customHtmlEditor"></div><br>'+
				'				<div ng-hide="modalPage==\'googleAnalytics\'" class="right floated mini green ui button" ng-click="saveHtml(customHtmlName, customHtmlCode)">Save [[htmlTypeDisplay]]</div>'+
				'				<div ng-show="modalPage==\'googleAnalytics\'" class="right floated mini green ui button" ng-click="saveGoogleAnalytics()">Save Google Analytics</div>'+
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
			scope:{
		    	currentHtml:'=',
		    	currentHtmlType:'=',
		    	showModal:'=',
		    	pageSelected:'='
		    },
	        link: function(scope, element, attr){
				
	        	element.modal();

	        	scope.currentHtml='';
	        	scope.currentHtmlType='';
	        	scope.showModal=false;
	        	scope.htmlTypeDisplay='';
	        	scope.modalPage = 'select';

	        	var htmlType='';

	        	scope.$watch('showModal', function(showModal) {
					if(showModal){

						scope.modalPage = 'select';
						htmlType=scope.currentHtmlType;

						switch(htmlType) {
						    case 'header':
						        scope.htmlTypeDisplay='Header';
						        break;

						    case 'footer':
						        scope.htmlTypeDisplay='Footer';
						        break;
						}
						//console.log('testing');
						ajaxCallService.getJson('/theme-builder/html-list/'+siteID+'/'+htmlType)
							.then(function(htmlList) {
								scope.htmlList = htmlList.htmlList;

								//console.log(scope.htmlList);
							});

						scope.title=scope.htmlTypeDisplay+" List";
						
						element.modal('setting', {
							closable  : false,
							onDeny    : function(){
							},
							onApprove : function() {

							}
						})
						.modal('show')
						;

						scope.showModal = false;
					}
					
				});

				scope.$watch('modalPage', function(modalPage) {

					switch(modalPage) {
					    case 'select':
					        break;

					    case 'create':
					        element.css({'top':0,'margin-top':20});
					        break;

					    case 'edit':
					        element.css({'top':0,'margin-top':20});
					        break;

					    case 'googleAnalytics':
					        element.css({'top':0,'margin-top':20});
					        break;
					}	
				});

				scope.htmlEditor = CodeMirror(document.getElementById("customHtmlEditor"), {
		          	mode: "text/html",
		          	extraKeys: {"Ctrl-Space": "autocomplete"},
		          	lineNumbers: true,
		          	lineWrapping: true,
		          	styleActiveLine: true,
		          	matchBrackets: true,
		          	autocomplete: true,
		          	gutter: true,
		    		theme: 'ambiance'
		        });

				scope.htmlSelect = function(htmlCode, htmlSourceType){
					ajaxCallService.postJson('/theme-builder/html-select', {'siteID':siteID, 'pageFileName':scope.pageSelected, 'htmlType':htmlType, 'htmlCode':htmlCode, 'htmlSourceType':htmlSourceType, 'selectionType':'set'})
						.then(function(currentHtml) {
							scope.currentHtml = currentHtml;
							element.modal('hide');
						});
				};
				
				scope.createHtml = function(){

					scope.customHtmlCode='';
					scope.customHtmlName='';

					scope.modalPage = 'create';
					timeout(function () {
						scope.title='Create '+scope.htmlTypeDisplay;
						scope.htmlEditor.setValue('<!--Place your code here-->\n');
						scope.htmlEditor.focus();
						scope.htmlEditor.setCursor(2);
					},0);

				};

				scope.editGoogleAnalytics = function(){

					ajaxCallService.getJson('/theme-builder/google-analytics/'+siteID)
						.then(function(htmlContent) {
							scope.htmlEditor.setValue(htmlContent);
						});

					scope.modalPage = 'googleAnalytics';

					timeout(function () {
						scope.title='Edit Google Analytics';
						scope.htmlEditor.focus();
						scope.htmlEditor.setCursor(scope.htmlEditor.lastLine());
					},0);


				};

				scope.saveGoogleAnalytics = function(){

					ajaxCallService.postJson('/theme-builder/google-analytics', {'siteID':siteID, 'pageFileContent':scope.htmlEditor.getValue()})
						.then(function(htmlContent) {
							alert(htmlContent);
						});

				};

				scope.editHtml = function(htmlCode, htmlSourceType, htmlName){

					scope.customHtmlCode=htmlCode;
					scope.customHtmlName=htmlName;
					
					ajaxCallService.postJson('/theme-builder/html-select', {'siteID':siteID, 'pageFileName':scope.pageSelected, 'htmlType':htmlType, 'htmlCode':htmlCode, 'htmlSourceType':htmlSourceType, 'selectionType':'edit'})
						.then(function(htmlContent) {
							scope.htmlEditor.setValue(htmlContent);
						});

					scope.modalPage = 'edit';

					timeout(function () {
						scope.title='Edit '+scope.htmlTypeDisplay;
						scope.htmlEditor.focus();
						scope.htmlEditor.setCursor(scope.htmlEditor.lastLine());
					},0);

				};
				
				scope.saveHtml = function(customHtmlName, customHtmlCode){
					
					var customHtmlContent = scope.htmlEditor.getValue();

					ajaxCallService.postJson('/theme-builder/html-save', {'siteID': siteID, 'pageFileName': scope.pageSelected, 'htmlType': htmlType, 'customHtmlName': customHtmlName, 'customHtmlCode':customHtmlCode, 'customHtmlContent': customHtmlContent})
						.then(function(htmlList) {
							scope.htmlList = htmlList.htmlList;
							alert('Save Complete');
						});
					
				};

				
	        }
	    };
	}]);
	
	/*
	htmlBuilder.directive('modalPageType', function ($compile) {
		return {
		    restrict: 'A',
		    scope:{
		    	modalPageType:'@',
		    	modalPageListener:'@',
		    },
		    replace: true,
		    link: function (scope, element, attrs) {
				
				var modalPageType = scope.modalPageType;

				attrs.$observe('modalPageListener', function(selectedModalPage) {
					if(selectedModalPage==modalPageType){

						prevDisplay=element.css('display');
						element.css({'display':'block','visibility':'hidden'});
						element.css({'visibility':'visible'});

					} else {
						element.css('display','none');
					}
					
				});
			}
	  	};
	});
	*/

	htmlBuilder.service('ajaxCallService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
		
		this.getJson = function(extendedUrl) {
			var dfd = q.defer();

			http({
				method: 'GET',
				url: rootScope.baseUrl + extendedUrl,
				dataType: 'JSON'
			}).success(function(data) {
				dfd.resolve(data)
			}).error(function(data) {

			});

			return dfd.promise;
		};

		this.postJson = function(extendedUrl, params) {
			var dfd = q.defer();

			http({
				method: 'POST',
				url: rootScope.baseUrl + extendedUrl,
				dataType: 'JSON',
				data: params
			}).success(function(data) {
				dfd.resolve(data)
			}).error(function(data) {

			});

			return dfd.promise;
		};
	   	
	}]);
})();
