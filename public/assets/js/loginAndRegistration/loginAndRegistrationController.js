app.controller("LoginAndRegistrationController", function($scope, $http) {
    //AngularJS Stuff
    $scope.dashboard = '';
    $scope.errorMessage = '';

    $scope.modals = {
        forgotPassword: {
            show: false,
            isTransacting: false
        }
    };

    $scope.forgotEmail = '';    
    $scope.forgotPasswordMessage = {
        message: '',
        messageClass: '',
        show: false
    };
    
    $scope.setURI = function(url){
        $scope.dashboard = url;
    };
    
    $scope.showDimmer = function(className) {
        $(className).dimmer({
            "closable": false
        }).dimmer('show');
    };

    $scope.hideDimmer = function(className) {
        $(className).dimmer('hide');
    };
    
    $scope.validateForm = function(){
        if ($("#frmUsername").val() === '') {
            $("#fieldUser").addClass('error');
            $("#form_error_1").show();
        } else {
            if (!$("#fieldUser").hasClass('error')) {
                $("#fieldUser").addClass('error');
            }
        }
        if ($("#frmPassword").val() === '') {
            $("#fieldPassword").addClass('error');
            $("#form_error_2").show();
        } else {
            if (!$("#fieldPassword").hasClass('error')) {
                $("#fieldPassword").addClass('error');
            }
        }
    };

    $scope.submitForm = function() {
        $scope.showDimmer('.page.dimmer');
        
         $http.post('users/login', {'frmUsername': $("#frmUsername").val(), 'frmPassword': $("#frmPassword").val()}).success(function(data, status, headers, config) {
            if(data.result === 'fail') {
                $scope.errorMessage = data.error_message;
                $("#errorMessage").show();
                $scope.validateForm();
//                $("#fieldUser").addClass('error');
//                 $("#fieldPassword").addClass('error');
                $scope.hideDimmer('.page.dimmer');
            } else if(data.result === 'success') {
                $scope.errorMessage = '';
                $("#errorMessage").hide();
                window.location = $scope.dashboard;
            }
        });
    };

    //jQuery Stuff
    $(document).ready(function() {
        $("#frmUsername").focus();
        $("#errorMessage").hide();

        $('.input').keypress(function(e) {
            if (e.which === 13) {
//                $('form#frmLogin').submit();
                angular.element('#LoginAndRegistration').scope().submitForm();
                return false;
            }
        });

        $("#frmUsername").blur(function() {
            if ($("#frmUsername").val() === '') {
                $("#fieldUser").addClass('error');
                $("#form_error_1").show();
            } else {
                if ($("#fieldUser").hasClass('error')) {
                    $("#fieldUser").removeClass('error');
                    $("#form_error_1").hide();
                }
            }
        });
        $("#frmPassword").blur(function() {
            if ($("#frmPassword").val() === '') {
                $("#fieldPassword").addClass('error');
                $("#form_error_2").show();
            } else {
                if ($("#fieldPassword").hasClass('error')) {
                    $("#fieldPassword").removeClass('error');
                    $("#form_error_2").hide();
                }
            }
        });

//        $("#frmLogin").submit(function() {
//            if ($("#frmUsername").val() === '' || $("#frmPassword").val() === '') {
//                if ($("#frmUsername").val() === '') {
//                    $("#fieldUser").addClass('error');
//                    $("#form_error_1").show();
//                } else {
//                    if ($("#fieldUser").hasClass('error')) {
//                        $("#fieldUser").removeClass('error');
//                        $("#form_error_1").hide();
//                    }
//                }
//                if ($("#frmPassword").val() === '') {
//                    $("#fieldPassword").addClass('error');
//                    $("#form_error_2").show();
//                } else {
//                    if ($("#frmPassword").hasClass('error')) {
//                        $("#fieldPassword").removeClass('error');
//                        $("#form_error_2").hide();
//                    }
//                }
//                
//                return false;
//            } else if ($("#frmUsername").val() !== '' && $("#frmPassword").val() !== '') {
//                if ($("#fieldUser").hasClass('error')) {
//                    $("#fieldUser").removeClass('error');
//                }
//                if ($("#frmPassword").hasClass('error')) {
//                    $("#fieldPassword").removeClass('error');
//                }
//                $scope.showDimmer('.page.dimmer');
//                $('#frmLogin').submit();
//            }
//        });
        $("#btnSubmit").click(function() {
            angular.element('#LoginAndRegistration').scope().submitForm();
        });
    });
});