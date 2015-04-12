(function() {
    var customModal = angular.module('customModal', []);

	customModal.directive('customModal', ['customModalService', function(customModalService) {
		return {
			templateUrl: 'views/get/templates.modalTemplate',
			restrict: 'E',
			replace: true,
			scope: {
	            watch: '=',
	            content: '=?',
	            settings: '=?'
	        },
	        link: function(scope, element, attrs){
	        	//console.log(scope.content);
	        	scope.content = scope.content || {
	        		title:"Modal Form",
                    body:{
                    	html:"<div>No Content</div>",
                    },
                    actions:{
                        approve:{show:true,name:"Select",class:"positive small"},
                        deny:{show:true,name:"Close",class:"negative small"},
                    }

	        	}

	        	scope.content.body = scope.content.body || {}

	        	scope.content.body.dimmer = false;

	        	scope.settings = scope.settings || {};


	        	if(!customModalService.modalExists(attrs.watch)){
	        		setModal();
	        		initModalWatcher();
	        		initSettingsWatcher();
	        		customModalService.registerModal(attrs.watch);
	        	}else{
	        		//console.log('Warning: The watch you are trying to use already belongs to other modal');
	        	}

	        	function setModal(){
		        	element.modal("setting", scope.settings);
		        }

		        function initSettingsWatcher(){
		        	scope.$watch('settings', function() {
		        		setModal();
		        	});
		        }

		        function initModalWatcher(){

		        	scope.$watch('watch', function(command) {

	                    if (command) {	        	
							
							element.modal('show');

							//scope.watch = false;
							//console.log(element.modal('is active'));

	                    } else{
	                  		//console.log(command);
	                    	//console.log(element.modal('is active'));
	                    	//element.modal('hide');

	                    }

	                });
				}

		    }
	    };
	}]);
	
	customModal.directive('customModalContent', ['customModalService', '$compile', function(customModalService, compile) {
		return {
			restrict: 'A',
			replace: true,
			scope: {
	            customModalContent: '='
	        },
	        link: function(scope, element, attrs){
	        	
	        	scope.$watch('customModalContent', function(customModalContent) {
	        		//console.log(scope.customModalContent.dimmer);
	        		//console.log(customModalContent);
	        		element.transition('fade out','0ms');
	        		scope.customModalContent.dimmer=true;

	        		
	        		if(customModalContent.html!=undefined && customModalContent.html!=null && customModalContent.html!=''){
	        			
	        			compileModalContent(customModalContent.html);

	        		}else if (customModalContent.link!=undefined && customModalContent.link!=null && customModalContent.link!=''){
	        			
	        			customModalService.getModalContent(customModalContent.link)
							.then(function(modalContent) {

								compileModalContent(modalContent);								
								
							});

	        		}else{

	        			compileModalContent('<div>No Content</div>');

	        		}

	        	});
				
				function compileModalContent(modalContentHtml){
					element.html(modalContentHtml);
	    			compile(element.contents())(scope);
	    			element.transition('fade in');
					scope.customModalContent.dimmer=false;
				}
		    }
	    };
	}]);

	customModal.directive('compileButton', ['$compile', function (compile) {
	    return {
	        restrict: 'A',
	        replace: true,
			scope: {
	            compileButton: '='
	        },
	        link: function (scope, element, attrs) {

	        	element.html('<div class="ui button '+scope.compileButton.class+'"'+scope.compileButton.command+'>'+scope.compileButton.name+'</div>');
	        	compile(element.contents())(scope);
	        }
	    }
	}]);

	customModal.service('customModalService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

		var _existingModals = [];

		this.registerModal = function(modalWatch) {
			_existingModals.push(modalWatch);
		};

		this.modalExists = function(modalWatch) {
			return ($.inArray(modalWatch, _existingModals)!=-1);
		};

        this.getModalContent = function(extendedUrl) {
            var dfd = q.defer();
            
            http({
                url:  rootScope.baseUrl +'/'+ extendedUrl,
                method: 'GET',
                dataType: 'JSON'
            }).success(function(data) {
                dfd.resolve(data);
            }).error(function(data) {
                window.alert('There was an error when processing your request.');
            });

            return dfd.promise;
        };
    }]);

})();