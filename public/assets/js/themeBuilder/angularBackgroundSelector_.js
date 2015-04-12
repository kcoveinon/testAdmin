(function() {

	var app = angular.module('angularBackgroundSelector', [])

	app.directive('backgroundImageSelector', ['$compile', '$http', '$sce', '$rootScope', function($compile, $http, $sce, rootScope) {
		return {
			restrict: 'E',
			replace: true,
			require: '?ngModel',
			template: function(element, attrs) {
				
				var template = 
					'<div>'+
					'	<div class = "ui basic bottom small labeled icon fluid button background-image-selector-button">'+
					'		<div>Select Background</div>'+
					'		<i class = "black inverted small photo icon"></i>'+
					'	</div><div class="ui fluid background-image-selector-divider"></div>'+
					'	<div class = "ui transition hidden box-shadow9 background-image-selector-content" style="position:absolute;">'+
					'		<div class="background-image-selector-image-display">'+
					'			<div>'+
					'				<div class="ui fluid" style="align:center;color:#555555;font-weight:bold;text-align:center;font-size:12px;margin-bottom:2px;">Select Image</div>'+
					'				<input class="background-image-selector-upload" type="file" style="display:none;" multiple>'+
					'				<div class = "background-image-selector-url-input ui fluid input" style="display:none!important;"><input type="text" placeholder="Place the image URL here..." style="font-size:12px;height:28px;font-weight:normal;"></div>'+
					'				<div class = "background-image-selector-upload-actions two mini fluid ui buttons">'+
					'					<div class = "background-image-selector-upload-button ui black button"><span style="text-transform:capitalize">Upload Image</span></div>'+
					'					<div class="or"></div>'+
					'					<div class = "background-image-selector-url-button ui black button"><span style="text-transform:capitalize">Image </span><span style="text-transform:uppercase">URL</span></div>'+
					'				</div>'+
					'				<div class="background-image-selector-upload-preview-background"><div class="background-image-selector-upload-preview"></div></div>'+
					'				<div class="background-image-selector-upload-preview-actions ui mini vertical buttons">'+
					'					<div class="background-image-selector-upload-preview-save ui green inverted icon button"><i class="save icon"></i></div>'+
					'					<div class="background-image-selector-upload-preview-cancel ui red inverted icon button"><i class="remove icon"></i></div>'+
					'				</div>'+
					'			</div>'+
					'		</div>'+
					'		<div class="background-image-selector-image-list-wrapper">'+
					'			<div class="background-image-selector-image-list">'+
					'				<div class="background-image-selector-image-container" ng-repeat="imagePath in imagePaths" ng-click="selectImage($event)"><img ng-src="{{imagePath}}"></div>'+
					'			</div>'+
					'		</div>'+
					'		<div class="background-image-selector-actions ui mini vertical buttons">'+
					'			<div class="background-image-selector-add ui icon button"><i class="add icon"></i></div>'+
					'			<div class="background-image-selector-remove ui icon button"><i class="trash icon"></i></div>'+
					'		</div>'+
					'	</div>'+
					'</div>';
					
				return template;
			},
			link:function($scope,element,attr,ngModel){
							
				//if(!ngModel) console.error('ng-model is required for this directive');
				
				//if(!imageFolderPath) console.error('image-path is required for this directive');
				
				/*
				imageList.success(function(data) {
					$scope.imagePaths = data.imagePaths;
				});
				*/
				//attr.imagesFolderPath;
				$scope.imagePaths=[];
				
				getImagePaths(siteID);
				
				function getImagePaths(siteID){
					$http.get('http://admin.vroomvroomvroom.eu/imageFolder/images/'+pageFileName+'/'+siteID)
						.then(function(result) {
							$scope.imagePaths = result.data.imagePaths;
					});
				}
				
				
				var initValue = $scope.$eval(attr.ngModel);
				var imageFileName = initValue.replace(/^.*[\\\/]/, '');
				var imageFileName = imageFileName.replace(')', '');
				//alert(imageFileName);
				
				//alert($scope.$eval(attr.ngModel));
				element.find('.background-image-selector-image-display').css('background-image',initValue);
				
				element.find('.background-image-selector-image-display div').css('display','none');
				/*
				element.find('.background-image-selector-image-list').mousewheel(function(event, delta){
					this.scrollLeft -= (delta * 30);
					event.preventDefault();
				});
				*/
				element.find('.background-image-selector-image-list').bind('mousewheel',function(event, delta){
					this.scrollLeft -= (delta * 30);
					event.preventDefault();
				});
				
				element.find('.background-image-selector-button').bind('click',function(){
					if(element.find('.background-image-selector-content').hasClass('hidden')){
						/*
						element.find('.background-image-selector-image-container').bind('click',function(){
							newBackgroundImage = 'url('+$(this).find('img').attr('src')+')';
							ngModel.$setViewValue(newBackgroundImage);
							element.find('.background-image-selector-image-display').css('background-image',newBackgroundImage);
							element.find('.background-image-selector-image-display div').css('display','none');
							element.find('.active-image').removeClass('active-image');
							$(this).find('img').addClass('active-image');
						});*/
						newBackgroundImage = 'url('+element.find('.background-image-selector-image-container').find('img[src$="'+imageFileName+'"]').attr('src')+')';
						element.find('.background-image-selector-image-display').css('background-image',newBackgroundImage);
						element.find('.background-image-selector-image-display div').css('display','none');
						element.find('.background-image-selector-image-container').find('img[src$="'+imageFileName+'"]').addClass('active-image');
					}
					
					element.find('.background-image-selector-content').transition('slide down show');
				});
				
				$scope.selectImage = function(e){
					newBackgroundImage = 'url('+$(e.target).attr('src')+')';
					//console.log(newBackgroundImage);
					//console.log(ngModel.$setViewValue);
					//ngModel.$setViewValue(newBackgroundImage);
					ngModel.$setViewValue('url('+$(e.target).attr('src')+')');
					element.find('.background-image-selector-image-display').css('background-image',newBackgroundImage);
					element.find('.background-image-selector-image-display div').css('display','none');
					element.find('.active-image').removeClass('active-image');
					$(e.target).addClass('active-image');
				};
				
				element.find('.background-image-selector-add').bind('click',function(){
					element.find('.background-image-selector-image-display').css('background-image','');
					element.find('.background-image-selector-image-display div').css('display','block');
				});
				
				element.find('.background-image-selector-upload-button').bind('click',function(){
					element.find('.background-image-selector-upload').trigger('click');
				});
				
				element.find('.background-image-selector-url-button').bind('click', function(){
					element.find('.background-image-selector-upload-actions').fadeOut();
					element.find('.background-image-selector-url-input').fadeIn();
				});
				
				var reader = new FileReader();
				
				reader.onload = function (event){
					element.find('.background-image-selector-upload-preview').css('background-image','url('+event.target.result+')')
					ngModel.$setViewValue('url(http://admin.vroomvroomvroom.eu/'+event.target.result+')');
					$scope.uploadImage = event.target.result;
					//console.log(event.target.result);
				};
					
				element.find('.background-image-selector-upload').bind('change', function(e){
					console.log(reader.readAsDataURL((e.srcElement || e.target).files[0]));
				});
				
				element.find('.background-image-selector-url-input input').bind('change', function(){
					tempBackgroundImage = 'url('+$(this).val()+')';
					element.find('.background-image-selector-upload-preview').css('background-image', tempBackgroundImage);
					$scope.uploadImage = $(this).val();
					//ngModel.$setViewValue(tempBackgroundImage);
					ngModel.$setViewValue('url(http://admin.vroomvroomvroom.eu/'+$(this).val()+')');
				});
				
				element.find('.background-image-selector-upload-preview-save').bind('click', function(){
					
					$http.post('http://admin.vroomvroomvroom.eu/imageFolder/upload-image', {'siteID': siteID, 'image': $scope.uploadImage, 'pageFileName': pageFileName}).success(function(data) {
						//console.log(data);
						if(data=='Upload Complete'){
							element.find('.background-image-selector-image-display').css('background-image','');
							element.find('.background-image-selector-image-display div').css('display','none');
							getImagePaths(siteID);
						}else{
							alert('Problem encountered while uploading the image. Please try again later.');
						}
					});
				});
				
				element.find('.background-image-selector-upload-preview-cancel').bind('click', function(){
					element.find('.background-image-selector-image-display').css('background-image','');
					element.find('.background-image-selector-image-display div').css('display','none');				
				});
				
				element.find('.background-image-selector-remove').bind('click',function() {
					$http.post('http://admin.vroomvroomvroom.eu/imageFolder/delete-image', {'siteID': siteID, 'pageFileName': pageFileName, 'image': element.find('.active-image').attr('src')}).success(function(data) {
						//console.log(data);
						//alert(data);
						getImagePaths(siteID);
					});
				});
				
			}
		  };
	}]);

})();