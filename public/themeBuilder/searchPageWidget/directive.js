var app = angular.module('vroomWidgetDirective', []);
/*
app.directive('vroomWidget', function() {
	return {
		template: function(element, attrs) {
			
			var template = 
				'<div>'+
				'	testing'+
				'</div>';
				
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			
        }
    };
});
*/
/*
app.directive('vroomWidget', function($http) {
	return {
		template: function(element, attrs){
			
			//$http.get('/imageFolder/images/'+pageFileName+'/'+siteID)
			//	.then(function(result) {
			//		$scope.imagePaths = result.data.imagePaths;
			//});
			
			
			var greeting = 'testing';
			
			var template = $http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Yawn!!!")
				.success(function(data) {
					data = data;
					name = data.name;
					salutation = data.salutation;
					greeting = data.greeting;
					console.log(greeting+" "+salutation+" "+name+" "+data);
					
					return greeting;
				});
			
			//var template = 
			//	"<div>"+greeting+"</div>";
				
			console.log(template);
			return template;
		},
		restrict: 'E',
		replace: true,
		require: '?ngModel',
        link: function($scope, element, attr, ngModel){
			
        }
    };
});
*/



app.directive('vroomWidget', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, element, attrs) {
      scope.$watch(attrs.vroomWidget, function(html) {
        element.html(html);
        $compile(element.contents())(scope);
      });	  
    }
  };
});

