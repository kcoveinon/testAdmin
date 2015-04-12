@section('loginContent')
<div class="ui fluid form" ng-init="setURI('{{URL::to('/')}}')">

    @if(!empty($loginViaMessage))
        <div class="ui red message">{{{ $loginViaMessage }}}</div>
    @endif
    
    <form action="users/login" method="POST" id="frmLogin">        
        {{ Form::token() }}
        <div class="field">
            <!--<div class="ui fluid" style="background-image: url('assets/images/logo-large.png'); background-repeat: no-repeat; background-position: center; height: 18rem;"></div>-->
            <div style="margin-left: 41%;">
                {{ HTML::image('assets/img/global/logo-large.png') }}
            </div>
        </div>
        <div class="field"  style="margin-left: 30%; margin-right: 30%;">
            <div class="ui fluid center purple aligned large header">
                Welcome to Vroomvroomvroom Administration Login.
            </div>
        </div>
        <div id="errorMessage" class="ui red message center ng-cloak" style="text-align: center; margin-left: 30%; margin-right: 30%; display:none;" ng-cloak>
            [[errorMessage]]
        </div>
        <div id="fieldUser" class="field" style="margin-left: 30%; margin-right: 30%;">
            <div class="ui left labeled icon input">
                <input type="text" name="frmUsername" id="frmUsername" ng-model="frmUsername" placeholder="Username">
                <i class="user icon"></i>
                <div class="ui corner label">
                    <i class="icon asterisk"></i>
                </div>
            </div>
            <div class="ui red pointing label" id="form_error_1" style="display: none;">
                Please enter a value
            </div>
        </div>
        <div id="fieldPassword" class="field"  style="margin-left: 30%; margin-right: 30%;">
            <div class="ui left labeled icon input">
                <input type="password" name="frmPassword" id="frmPassword" ng-model="frmPassword" placeholder="Password">
                <i class="lock icon"></i>
                <div class="ui corner label">
                    <i class="icon asterisk"></i>
                </div>
            </div>
            <div class="ui red pointing label" id="form_error_2" style="display: none;">
                Please enter a value
            </div>
        </div>
        <div class="field" style="margin-left: 30%; margin-right: 30%; margin-bottom: .3em">
            <!--<div name="btnSubmit" class="ui blue submit button">Login</div>-->
            <!--<input type="submit" name="btnSubmit" value="Login" class="ui orange submit button" ng-click="showDimmer('.page.dimmer')">-->
            <input type="button" name="btnSubmit" id="btnSubmit" value="Login" class="ui orange submit button">
            <div class="ui orange button" login-via-google-action>
                Login Via Google
            </div>
            <div class="ui orange button" login-via-vroom-action>
                Login Via Vroom
            </div>
            <!--<input type="submit" name="btnSubmit" id="btnSubmit" value="Login" class="ui orange submit button">-->                        
        </div>
        <div class="field" style="margin-left: 30%; margin-right: 30%;">
            <a forgot-password-button-action class="forgot-password-button">Forgot your password?</a>
        </div>        
    </form>

</div>
<div class="ui small forgot-password modal" forgot-password-modal-action>
    <div class="header">
        Forgot Password
    </div>
    <div class="content">
        <div class="ui [[ forgotPasswordMessage.messageClass ]] floating message ng-cloak" forgot-password-message-action ng-cloak>
            <i class="hide" forgot-password-message-close-button-action>x</i>
            [[ forgotPasswordMessage.message ]]
        </div>
        <div class="ui header">
            Provide us your e-mail address and a link will be sent to your inbox in order to create a new password.
        </div>
        <div class="ui mini input">
            <input type="text" placeholder="Enter your e-mail address" ng-model="forgotEmail">
        </div>
    </div>
    <div class="actions">
        <div class="ui deny button" ng-class="{ disabled: (modals.forgotPassword.isTransacting) }">Cancel</div>
        <div class="ui approve primary button" ng-class="{ disabled: (modals.forgotPassword.isTransacting) }">Forgot Password</div>
    </div>
</div>
@stop