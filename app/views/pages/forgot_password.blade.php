@extends('layouts.forgot_password')

@section('content')
	<div class="ui one column page grid stackable" ng-controller="ForgotPasswordController" ng-init="baseUrl = '{{ URL::to('/') }}'; forgotPasswordParams.forgotPasswordCode = '{{ $forgotPasswordCode }}';">
		<div class="column">
			<div class="ui medium header" style="text-align: center">
				Create New Password
			</div>
		</div>
		<div class="column">
			<div class="ui blue small form segment forgot-password box">				
				<div class="field" ng-class="{'error' : validationResult.email != ''}">
					<label>Confirm E-mail Address</label>
					<input type="text" placeholder="Please confirm e-mail address" ng-model="forgotPasswordParams.email" />
					<div class="ui red pointing label ng-cloak" ng-if="validationResult.email != ''" ng-cloak>
				    	[[ validationResult.email ]]
				    </div>
				</div>
				<div class="field" ng-class="{'error' : validationResult.password != ''}">
					<label>New Password</label>
					<input type="password" placeholder="Please type your new password" ng-model="forgotPasswordParams.password" />
					<div class="ui red pointing labelng-cloak" ng-if="validationResult.password != ''" ng-cloak>
				    	[[ validationResult.password ]]
				    </div>
				</div>				
				<div class="field" ng-class="{'error' : validationResult.retype != ''}">
					<label>Re-type Password</label>
					<input type="password" placeholder="Please retype your new password" ng-model="forgotPasswordParams.retype" />
					<div class="ui red pointing label ng-cloak" ng-if="validationResult.retype != ''" ng-cloak>
				    	[[ validationResult.retype ]]
				    </div>
				</div>				
				<div class="ui primary fluid button" create-new-password-button-action ng-class="{ disabled: (isTransacting) }">
					Create new password
				</div>
			</div>
		</div>
	</div>
@stop