<div ng-controller="UserAdminController">
    @if(count($errors->all()) > 0)
    <div class="ui error message">
        <ul>
            @foreach($errors->all() as $error)
            <li>{{ $error}}</li>
            @endforeach
        </ul>
    </div>
    @endif
    <div>
        <div class="ui form center">
            {{ Form::token() }}
            <input type="hidden" id="frmCompanyID" name="frmCompanyID" ng-init="userFormParameters.frmCompanyID='{{ $companyID }}'" ng-model="userFormParameters.frmCompanyID" readonly="readonly" >
            <input type="hidden" id="frmUserID" name="frmUserID" ng-init="userFormParameters.frmUserID='{{ $data->company_userID or '' }}'" ng-model="userFormParameters.frmUserID" readonly="readonly">
            <div class="two fields">
                <div class="field">
                    <label>Username</label>
                    <input type="text" id="frmUsername" name="frmUsername" placeholder="Username" ng-init="userFormParameters.frmUsername='{{ $data->name or '' }}'" ng-model="userFormParameters.frmUsername">
                </div>
                <div class="field">
                    <label>Email</label>
                    <input type="text" id="frmEmail" name="frmEmail" placeholder="Email Address" ng-init="userFormParameters.frmEmail='{{ $data->email or '' }}'" ng-model="userFormParameters.frmEmail">
                </div>
                <div class="field">
                    <label>Password</label>
                    <input type="password" id="frmPassword" name="frmPassword" placeholder="Password" ng-model="userFormParameters.frmPassword">
                </div>
                <div class="field">
                    <label>Confirm Password</label>
                    <input type="password" id="frmConfirmPassword" name="frmConfirmPassword" placeholder="Confirm Password" ng-model="userFormParameters.frmConfirmPassword">
                </div>
            </div>
            @if(isset($data))
            <div id="submitBtn" name="submitBtn" class="ui blue submit button" edit-user-action>Update User</div>
            @else
            <div id="submitBtn" name="submitBtn" class="ui blue submit button" add-user-action>Save User</div>
            @endif
        </div>
    </div>
</div>