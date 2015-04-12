angular.module('angularColorPicker', [])

.directive('colorPicker', function(){
  return {
	template: function(element, attrs) {
		
		//defaultValue = attrs.value
		
		var template = 
			'<input '+
				'style="display:none;"'+
			'/>';
		
		return template;
	},
	restrict: 'E',
	replace: true,
    require: '?ngModel',
    link: function (scope, elem, attrs, ngModel) {
      //elem.spectrum();
		var isOpacity = (attrs.includeOpacity=='y');
		if(isOpacity) var opacityValue = 1;
		
		if(ngModel) var value = scope.$eval(attrs.ngModel); //Check for ngModel. We will prioritize ngModel over value
		
		if(value==""||value==null) var value = attrs.value;
		
		if(value==""||value==null) value='#ffffff';
		
		if(value.charAt(3)=='a'){
			var result = /rgba\((.*?),(.*?),(.*?),(.*?)\)/i.exec(value);
			value='rgb('+parseInt(result[1])+','+parseInt(result[2])+','+parseInt(result[3])+')';
			if(isOpacity) opacityValue=result[4];
		}
		
		if(value.charAt(0)!='#') value = rgbToHex(value);
		
		value = value.replace(' ','');
		
		elem.minicolors({
			animationSpeed: 50,
			animationEasing: 'swing',
			hideSpeed: 400,
			showSpeed: 400,
			control: 'wheel',
			defaultValue: value,
			theme: 'semantic',
			opacity: isOpacity,
			change: function(hex, opacity) {
				
				if(!hex) return;
				
				if(!opacity)opacity=1;
				
				if(hex.charAt(0)=='#'){
					rgbFormat = hexToRgb(hex);
				}else if(hex.charAt(3)=='a'){
					var result = /rgba\((.*?),(.*?),(.*?),(.*?)\)/i.exec(hex);
					rgbFormat ? {
						r: parseInt(result[1]),
						g: parseInt(result[2]),
						b: parseInt(result[3])
					} : null;
				}else{
					var result = /rgb\((.*?),(.*?),(.*?)\)/i.exec(hex);
					rgbFormat ? {
						r: parseInt(result[1]),
						g: parseInt(result[2]),
						b: parseInt(result[3])
					} : null;
				}
				rgbaTextFormat = 'rgba('+rgbFormat.r+','+rgbFormat.g+','+rgbFormat.b+','+opacity+')';
				
				elem.val(rgbaTextFormat);

			},
		});
		
		if(isOpacity) elem.minicolors('opacity',opacityValue);

		
		
		//conversion functions
		
		function hexToRgb(hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}
		
		function rgbToHex(rgbTextFormat) {
			var result = /rgb\((.*?),(.*?),(.*?)\)/i.exec(rgbTextFormat);
			return "#" + ((1 << 24) + (parseInt(result[1]) << 16) + (parseInt(result[2]) << 8) + parseInt(result[3])).toString(16).slice(1);
		}
		
    }
  }
});
