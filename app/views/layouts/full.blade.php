<!DOCTYPE html>
<html lang="en" ng-app="VroomAdministrationApp">
    <head ng-init="baseUrl ='{{ URL::to('/') }}';">
        <meta charset="utf-8">
        <meta name="author" content="dgcarungay">
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <title>Administration</title>
        @include('layouts.css')
    </head>
    <body class="side top pushed">
        <div>
            <div id="mainWrapper">
                <div id="menuWrapper">
                    @include('layouts.header')
                </div>
                <div id="contentWrapper">
                    <div class="content" id="content-area" content-area></div>
                </div>
                
            </div>
            <div class="ui page dimmer" custom-dimmer watch="showFullPageDimmer" settings="fullPageDimmerSettings">
                <div class="content">
                    <div class="ui text big loader center">Loading</div>
                </div>
            </div>
        </div>
        
        @include('layouts.js')
    </body>
</html> 