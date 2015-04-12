function initializePlugins(){
	
	//var vroomDomainName = 'http://54.79.109.125/vroomAdmin/public/';
	//var vroomDomainName = 'http://admin.vroomvroomvroom.eu/';
	var vroomDomainName = 'http://admin.vroomvroomvroom.eu/';
	
	if (!window.angular) {
		var jq = document.createElement('script'); jq.type = 'text/javascript';
		jq.src = vroomDomainName+'themeBuilder/searchPageWidget/angular.min.js';
		jq.async = false;
		document.getElementsByTagName('head')[0].appendChild(jq);
	}
	
	if (!window.jQuery) {
		var jq = document.createElement('script'); jq.type = 'text/javascript';
		jq.src = vroomDomainName+'themeBuilder/searchPageWidget/jquery.min.js';
		jq.async = false;
		document.getElementsByTagName('head')[0].appendChild(jq);
	}
	
	
	var jq = document.createElement('link'); jq.type = 'text/css'; jq.rel = 'stylesheet';
	jq.href = vroomDomainName+'themeBuilder/searchPageWidget/autocomplete-directive.css';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	var jq = document.createElement('link'); jq.type = 'text/css'; jq.rel = 'stylesheet';
	jq.href = vroomDomainName+'themeBuilder/searchPageWidget/semantic.css';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/directive.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/pages/searchPage720x520/jquery.datetimepicker.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	/*
	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/semantic.min.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);
	*/

	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/autocomplete.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/angular-sanitize.min.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);

	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/semantic.min.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);
	
	var jq = document.createElement('script'); jq.type = 'text/javascript';
	jq.src = vroomDomainName+'themeBuilder/searchPageWidget/app.js';
	jq.async = false;
	document.getElementsByTagName('head')[0].appendChild(jq);
	
	var position = $('#vroomWidgetPosition').position().top;
	
	console.log(position);

	$('#vroomWidgetPosition').html('<img src="http://www.healthstatus.com/wp-content/themes/healthstatus/images/loading.gif" style="margin-left:auto; margin-right:auto; display:block; padding-top:210px;"  >');
	$('body').after('<div id="vroomWidgetContent" ng-controller="vroomWidgetController" vroom-widget="html" style="display:none; position:absolute; width:100%; height:600px; top:'+position+'px; z-index:999999999;"></div>');
	//document.getElementById('vroomWidgetContent').innerHTML='<div ng-app="vroomWidgetModule" ng-controller="vroomWidgetController"><vroom-widget></vroom-widget></div>';
	
	
}

window.onload=function(){
	initializePlugins();
};


