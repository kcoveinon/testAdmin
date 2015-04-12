<html lang="en" ng-app="emailTemplate">
<head>


	<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/font_awesome/font-awesome.min.css') }}" />
	<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/semantic_ui/semantic.css') }}" />
	<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/jquery-ui.css') }}" />
	<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/results/results.css') }}" />
	<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/emailTemplate/css/jquery.notebook.min.css') }}" />

	<style>
		body{
			font-family:"Open Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;;
		}
		
	</style>


	<link rel="stylesheet" type="text/css" href="{{ asset('assets/css/themeBuilder/pages/themeBuilder.css') }}" />
	<style id="iframeStylePreview">
	</style>


</head>

<body>
	<div style="width:70%;margin:auto;">
		<div class="partner header" html-builder current-html="currentHtml" current-html-type="htmlType" html-type="header" show-modal = "showHtmlBuilderModal">
			@include('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.header')
		</div>
		<div j-query-note-book style="margin-top:100px;margin-bottom:100px;">
			<h1>Welcome to Email Builder</h1>
			<p>Please place the content of your email here.</p>
			<p>To edit font, highlight first the text you want to edit.</p>
		</div>
		<div class="partner footer" html-builder current-html="currentHtml" current-html-type="htmlType" html-type="footer" show-modal = "showHtmlBuilderModal">
			@include('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.footer')
		</div>
	</div>


	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/jquery.min.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/angularjs/angular.min.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/semantic_ui/semantic.min.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/angularjs/angular-sanitize.min.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/jquery-ui.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/emailTemplate/js/app.js') }}"></script>
	<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/emailTemplate/js/jquery.notebook.min.js') }}"></script>
	
	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/themeBuilder/pages/themeBuilder.js') }}"></script>

</body>
</html>