/************
Theme Builder Controller.
 ************/

(function() {

    var themeBuilder = angular.module('themeBuilderController', [
    ]);
	
	themeBuilder.controller('themeBuilderController', ['ajaxCallService', '$scope', '$http', '$sce', '$timeout', function(ajaxCallService, $scope, $http, $sce, $timeout){
		
		$scope.sideBarStatus = false;
		$scope.fullSize = false;
		$scope.pageSelected = '';
		$scope.scssSelected = '';
		$scope.scssString = '';
		$scope.scssStringDefault = '';
		$scope.scssStringInit = '';
		$scope.scssStringCurrent = '';

		//For HTML Builder
		$scope.currentHtml = '';
		$scope.htmlType = '';
		$scope.showHtmlBuilderModal = false;
		
		/*
		$('.window').mousemove(function(){
			clearTimeout($scope.mouseIdleListenerTimeout);
		});
		*/
		
		$scope.pageListActive = true;
		
		ajaxCallService.getJson('/theme-builder/page-list/'+siteID)
			.then(function(pageList) {
				$scope.pageList = pageList;
			});
			
		$scope.stylePreview = function(variable, value){
			
			if(variable.substring(0, 8)=="$bgd_img") {
				var regex = new RegExp('\\'+variable+':url\\((.*?)\\);','g');
			} else {
				var regex = new RegExp('\\'+variable+':(.*?);','g');
			}
			$scope.scssStringCurrent = $scope.scssStringCurrent.replace(regex,variable+':'+value+';');
			$scope.applySCSS($scope.scssStringCurrent);		
			
		};
		
		$scope.applySCSS = function(scss){
			css = Sass.compile(scss);
			$scope.customStyle =  $sce.trustAsHtml(css);
			

			//Sending to iframe
			var win = document.getElementById('iframeStylePreview').contentWindow;

			var data = {
				'action':'changeStyle',
				'content' : $scope.customStyle+' '
			};

			// win.postMessage(JSON.stringify(data), 'http://localhost/vroomWeb_recode/public');
			win.postMessage(JSON.stringify(data), '*');// I'm using '*' for now but we should define the url


			//var doc = document.getElementById('iframeStylePreview').contentWindow.document;
			//var $body = $('.stylePreview',doc);
			
			//$body.html($scope.customStyle+' ');
		}

		$scope.$watch('currentHtml', function(currentHtml) {
			if(currentHtml!=""){
				//Sending to iframe
				var win = document.getElementById('iframeStylePreview').contentWindow;

				var data = {
					'action':'changeHtml',
					'content' : {
						type: $scope.htmlType,
						html: currentHtml,
					},
				};

				// win.postMessage(JSON.stringify(data), 'http://localhost/vroomWeb_recode/public');
				win.postMessage(JSON.stringify(data), '*');// I'm using '*' for now but we should define the url

				
			}
			
		});

		//receiving from iframe
		window.addEventListener('message', requestHtmlBuilder, false);

		function requestHtmlBuilder(event)
		{
		  	/*if ( event.origin !== "http://localhost/vroomAdmin_recode/public" )
		    return;*/

		    var data = JSON.parse(event.data);
		    //console.log(data);

		    switch(data.action) {
			    case 'requestHtmlBuilder':
			    	
			    	//console.log($scope.htmlType);
			    	//console.log($scope.showHtmlBuilderModal);

			    	$scope.htmlType = data.content;
					$scope.showHtmlBuilderModal = true;
					$scope.$apply();

					


			        break;
			    case 'getInitialHtml':

			    	ajaxCallService.getJson('/theme-builder/initial-html/'+siteID+'/'+$scope.pageSelected+'/'+data.content)
						.then(function(initialHtml) {
							//Sending to iframe
							var win = document.getElementById('iframeStylePreview').contentWindow;

							var param = {
								'action':'changeHtml',
								'content' : {
									type: data.content,
									html: initialHtml,
								},
							};

							// win.postMessage(JSON.stringify(param), 'http://localhost/vroomWeb_recode/public');
							win.postMessage(JSON.stringify(param), '*');// I'm using '*' for now but we should define the url
						});

			        break;

			    case 'showConfigurator':

			    	if(!$('.hideOnMouseIdle').first().transition('is visible')) 
						$('.hideOnMouseIdle').transition({
							animation 	: 'fade in',
							duration  	: '150ms'
						});

			    	break;

			    case 'hideConfigurator':
			    	//console.log('aw');
			    	$('.hideOnMouseIdle').transition({
						animation 	: 'fade out',
						duration  	: '700ms'
					});
				
			    	break;
			}

		}
		/*
		$timeout(function () {
			$scope.applySCSS($scope.scssStringCurrent);
		},0);
		*/
	}]);
	
})();