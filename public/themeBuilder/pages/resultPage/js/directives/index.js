
vroomApp.directive('styleSidebar', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.sidebar('toggle');
		}
	}
});

vroomApp.directive('styleAccordion', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.accordion();
		}
	};
});

vroomApp.directive('styleSelectbox', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.dropdown();
		}
	}
});

vroomApp.directive('styleDimmer', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.dimmer();
		}
	}
});

vroomApp.directive('stylePopup', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {

			elem.popup(JSON.parse(attrs.popupAttrs));	
		}
	}
});

vroomApp.directive('styleCheckboxGroup', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.find('.ui.checkbox').checkbox();
		}
	};
});

vroomApp.directive('styleCheckbox', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.checkbox();
		}
	};
});


vroomApp.directive('styleRangeSlider', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {			
			elem.ionRangeSlider(JSON.parse(attrs.sliderAttrs));
		}
	};
});


vroomApp.directive('styleJqSlider', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.addClass('customJqSlider');
			elem.slider();
			elem.append('<div class="ui label minimum">' + attrs.min + ' ' +  attrs.suffix + '</div>');
			elem.append('<div class="ui label maximum">' + attrs.max + ' ' + attrs.suffix + '</div>');

			var div_measurement = $('<div />');
			div_measurement.addClass('measurement');
			var span;
			var step;
			var smNum = 20;
			var bigNum = 4;
			var wid = elem.width();

			var stepFloat = 0;

			if (parseInt(settings.step, 10) !== parseFloat(settings.step)) {
                stepFloat = settings.step.toString().split(".")[1];
                stepFloat = Math.pow(10, stepFloat.length);
            }

			for(var i = 0; i <= smNum; i++) {
				
				step = Math.floor(wid / smNum * i);

				if(step >= wid) {
                	step = wid - 1;
                }

				span = $('<span />');
				span.addClass('bar small');
				span.css('left', step + 'px');
				div_measurement.append(span);
			}

			for (i = 0; i <= bigNum; i += 1) {
                step = Math.floor(wid / bigNum * i);

                if (step >= wid) {
                    step = wid - 1;
                }

                gridHTML += '<span class="irs-grid-pol" style="left: ' + step + 'px;"></span>';

                span = $('<span />');
				span.addClass('bar');
				span.css('left', step + 'px');

                if (stepFloat) {
                    text = (settings.min + ((settings.max - settings.min) / bigNum * i));
                    text = (text / settings.step) * settings.step;
                    text = parseInt(text * stepFloat, 10) / stepFloat;
                } else {
                    text = Math.round(settings.min + ((settings.max - settings.min) / bigNum * i));
                    text = Math.round(text / settings.step) * settings.step;
                    text = prettify(text);
                }

                if (allow_values) {
                    if (settings.hideMinMax) {
                        text = Math.round(settings.min + ((settings.max - settings.min) / bigNum * i));
                        text = Math.round(text / settings.step) * settings.step;
                        if (i === 0 || i === bigNum) {
                            text = settings.values[text];
                        } else {
                            text = "";
                        }
                    } else {
                        text = "";
                    }
                }

                if (i === 0) {
                    tStep = step;
                    gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px; text-align: left;">' + text + '</span>';
                } else if (i === bigNum) {
                    tStep = step - 100;
                    gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px; text-align: right;">' + text + '</span>';
                } else {
                    tStep = step - 50;
                    gridHTML += '<span class="irs-grid-text" style="left: ' + tStep + 'px;">' + text + '</span>';
                }
            }

			elem.append(div_measurement);
		}
	};
});

vroomApp.directive('styleDatepicker', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			elem.datepicker();
		}
	};
});

vroomApp.directive('styleAutocomplete', function() {
	return {
		restrict: 'A',		
		link: function(scope, elem, attrs) {
			var obj_autocomplete = elem.next();

			if(obj_autocomplete.children().children().length == 0) {
				obj_autocomplete.hide();
			}
		}
	}
}) 