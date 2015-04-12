<html>
    <head>
        <meta charset="utf-8">
        <meta name="author" content="jhing">
        <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <title>Login</title>
        <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700|Open+Sans:300italic,400,300,700' rel='stylesheet' type='text/css' />        
        {{ HTML::style("assets/css/vendor/semantic_ui/semantic.min.css"); }}
        {{ HTML::style("assets/css/global/main.css"); }}
        {{ HTML::style("assets/css/global/forgot_password.css"); }}
        {{ HTML::script("assets/js/vendor/jquery/jquery-1.11.1.min.js"); }}
        {{ HTML::script("assets/js/vendor/angularjs/angular.min.js"); }}
        {{ HTML::script("assets/js/vendor/semantic_ui/semantic.min.js"); }}
<!--        <script type="text/javascript" language="javascript" src="/public/assets/js/ForgotPassword/loginAndRegistrationApp.js"></script>
        <script type="text/javascript" language="javascript" src="/public/assets/js/loginAndRegistration/loginAndRegistrationController.js"></script>-->
        {{ HTML::script("assets/js/forgot_password/app.js"); }}
        {{ HTML::script("assets/js/forgot_password/controller.js"); }}
        {{ HTML::script("assets/js/forgot_password/directive.js"); }}
        {{ HTML::script("assets/js/forgot_password/service.js"); }}
    </head>
    <body>
        <div class="container" id="ForgotPassword" ng-app="ForgotPasswordApp">
        <!--<div class="container">-->
            @yield('content')
        </div>
        <div class="ui page dimmer">
           <div class="content">
               <div class="ui text loader center">Loading</div>
           </div>
       </div>
    </body>
</html>