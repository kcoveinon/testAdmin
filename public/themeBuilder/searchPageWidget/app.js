var app = angular.module('vroomWidgetModule', ['vroomWidgetDirective', 'autocomplete']);

app.controller('vroomWidgetController', ['$scope', '$http', function($scope, $http){
	
	/*
	$http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Yawn!!!")
		.success(function(data) {
			data = data;
			name = data.name;
			salutation = data.salutation;
			greeting = data.greeting;
			console.log(greeting+" "+salutation+" "+name+" "+data);
			
			$scope.html = greeting;
		});*/
	
	$http.jsonp("http://admin.vroomvroomvroom.eu/vroom-widget/request/JSON_CALLBACK/"+authenticationCode)
		.then(function(data) {
			//console.log(data);
			//console.log(data.content);
			
			$scope.html = data.data.content;
			
			$('#vroomWidgetPosition').animate({
				opacity: 0,
			}, {
				duration: 1000,
				queue: false,
				complete: function(){
					$('#vroomWidgetContent').fadeIn(500);
				},
			});
			
			
		});
	
	$scope.hidden=true;
	
	//**************** Collapse Effect *******************
	
	var currentDate = new Date();
	var dd = currentDate.getDate();
	var mm = currentDate.getMonth()+1;
	var yyyy = currentDate.getFullYear();
	var time = currentDate.getHours()+":"+currentDate.getMinutes()+":00";
	
	if(dd<10) {
		dd='0'+dd;
	} 

	if(mm<10) {
		mm='0'+mm;
	} 

	currentDate = yyyy+'-'+mm+'-'+dd+' '+time;
	
	$scope.autocompleteLoading = false;

	$scope.locationList = [];

	$scope.selectedPickupLocation = {
		id: '',
		value: ''
	}

	$scope.selectedReturnLocation = {
		id: '',
		value: ''
	}

	$scope.hideRetLoc = true;
	$scope.isCollapsed = true;
	//$scope.SelectedPickupID = 1926;
	//$scope.SelectedReturnID = 1926;
	$scope.frmDriverAge = 25;
	$scope.frmCitizenCountryID = 'AU';
	$scope.frmPickupDateTime = currentDate;
	$scope.frmReturnDateTime = currentDate;

	$scope.searchVehiclesAJAX = function(){
		var pickupDateTime = $('#frmPickupDateTime').val();
		var pickupDate = pickupDateTime.substring(0,10);
		//var pickupTime = pickupDateTime.substring(11);
		var pickupTime = pickupDateTime.substring(11,16);
		var returnDateTime = $('#frmReturnDateTime').val();
		var returnDate = returnDateTime.substring(0,10);
		//var returnTime = returnDateTime.substring(11);
		var returnTime = returnDateTime.substring(11,16);
		
		var win = window.open(
			'http://vroomvroomvroom.eu/fleet/' + pickupDate + '/' + pickupTime + '/' + 
			returnDate + '/' + returnTime + '/' + $scope.selectedPickupLocation.id + '/' + $scope.selectedReturnLocation.id + '/' +
			$scope.frmCitizenCountryID + '/' + $scope.frmDriverAge,
			'_blank'
		);
		
		if(win){
			//Browser has allowed it to be opened
			win.focus();
		}else{
			//Broswer has blocked it
			alert('Please allow popups for this site');
		}
	}
	
}]);

app.directive('pickupLocationAction', ['$http', '$timeout', function(http, timeout) {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			var promiseTimeout;
			elem.val('');
			scope.$watch('selectedPickupLocation', function(newVal, oldVal) {
				if(newVal.value != '' && newVal.id != '') {
					if(scope.initialSearch) {
						scope.initialSearch = false;
						
						timeout(function() {
							scope.showOther = true;
							scope.editPickupDate = true;
						}, 800);
					} else {
						scope.editPickupDate = true;
					}

					scope.selectedReturnLocation.id = scope.selectedPickupLocation.id;
					scope.selectedReturnLocation.value = scope.selectedPickupLocation.value;
					
				}
			}, true);

			elem.keyup(function(e) {
				var pickupLocationText = elem.val();
				scope.selectedPickupLocation.id = '';

				if(!scope.$$phase) {
					scope.$apply();
				}
				if((e.keyCode < 37 || e.keyCode > 40)) {
					if(e.keyCode != 13) {
						if(pickupLocationText == '') {
							scope.locations = [];
							scope.$apply();
						} else {
							
							timeout.cancel(promiseTimeout);
							promiseTimeout = timeout(function() {
								scope.autocompleteLoading = true;
								http.jsonp("http://admin.vroomvroomvroom.eu/vroom-widget/locations/callBackFunction/10/"+pickupLocationText+"/"+authenticationCode)
									.then(function(data) {
										//console.log(data.data);
										//console.log(data.content);
										//console.log(data);
										//scope.locationList = data;
										//console.log(data);
										//scope.autocompleteLoading = false;
										//elem.next().show();
										
									});
								/*
								locService.getLocations(pickupLocationText).then(function(locations) {
									scope.locations = locations;
									scope.pickupLocationQuerying = false;
									elem.next().show();
								});
								*/			
							}, 500);
							
						}
					}
				}
			});
			
			window.callBackFunction = function (data){
				//console.log(data);
				scope.$apply(function(){
					scope.locationList = data;
					console.log(scope.locationList);
					scope.autocompleteLoading = false;
					elem.next().show();
				});
			}

		}		
	};
}]);

angular.element(document.getElementById('vroomWidgetContent')).ready(function() {
  	angular.bootstrap(document.getElementById('vroomWidgetContent'), ['vroomWidgetModule']);
});
/*
function callBackFunction(data){

	var scope = angular.element($("#vroomWidgetContent")).scope();
    scope.$apply(function(){
        //scope.msg = 'Superhero';
        scope.locationList = data;
        scope.autocompleteLoading = false;
        $("#vroomWidgetContent").find(".selectedPickupLocation").next().show();
        //console.log(scope.locationList);
    })

}
*/
