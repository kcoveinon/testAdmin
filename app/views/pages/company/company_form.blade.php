<?php
// echo '<pre>';
// print_r($data);
// echo '</pre>';
?>

<div ng-controller="CompanyAdminController">
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
            @if(isset($data))
                <input type="hidden" id="frmCompanyID" name="frmCompanyID" ng-model="companyFormParameters.frmCompanyID" readonly="readonly" ng-init="companyFormParameters.frmCompanyID='{{$companyID or ''}}'">
                <div class="two fields">
                    <div class="field">
                        <label>Company Name:</label>
                        <input type="text" id="frmCompanyName" name="frmCompanyName" placeholder="Company Name" ng-init="companyFormParameters.frmCompanyName='{{$data['companyName'] or ''}}'" ng-model="companyFormParameters.frmCompanyName">
                    </div>
                    <div class="field">
                        <label>Company Alias:</label>
                        <h3 class="ui header">{{$data['alias']}}</h3>
                    </div>
                    <div>
                        <div class="ui top attached tabular menu">
                            <a class="active item" id="siteTab" company-tab-action>Sites</a>
                            <a class="item" id="userTab" company-tab-action>Users</a>
                        </div>
                        <div class="ui bottom attached active tab segment" id="siteTabContent">
                            <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;" new-record-click-action submodule="site" submodule-company-identifier="{{$companyID}}"><i class="add icon button"></i>Add New Site</div>
                            <j-grid
                                grid-columns="site_table_columns"
                                grid-id="company_site_grid"
                                grid-limit="10"
                                grid-offset="0"
                                grid-order-by="VVVSiteID"
                                grid-order-type="ASC"
                                grid-url="site-grid/show-site-grid/{{$companyID}}"
                                grid-method="GET"
                                grid-height="150px"
                                ></j-grid>
                        </div>
                        <div class="ui bottom attached tab segment" id="userTabContent">
                            <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;" new-record-click-action submodule="user"><i class="add icon button"></i>Add New User</div>
                            <j-grid
                                grid-columns="user_table_columns"
                                grid-id="company_user_grid"
                                grid-limit="10"
                                grid-offset="0"
                                grid-url="user-grid/show-user-grid/{{$companyID}}"
                                grid-method="GET"
                                grid-height="150px"
                                ></j-grid>
                        </div>
                    </div>
                    <div>&nbsp;</div>
                    <div>
                        <div id="submitBtn" name="submitBtn" class="ui blue submit button" edit-company-action>Update Company</div>
                        <div name="cancelBtn" class="ui negative button">Cancel</div>
                    </div>
                </div>
            @else
                <input type="hidden" id="frmCompanyID" name="frmCompanyID" ng-model="companyFormParameters.frmCompanyID" readonly="readonly" ng-init="companyFormParameters.frmCompanyID='{{$companyID or ''}}'">
                <div class="two fields">
                    <div class="field">
                        <label>Company Name:</label>
                        <input type="text" id="frmCompanyName" name="frmCompanyName" placeholder="Company Name" ng-init="companyFormParameters.frmCompanyName='{{$data['companyName'] or ''}}'" ng-model="companyFormParameters.frmCompanyName">
                    </div>
                    <div class="field">
                        <label>Company Alias</label>
                        <input type="text" id="frmCompanyAlias" name="frmCompanyAlias" placeholder="Company Alias" ng-init="companyFormParameters.frmAlias='{{$data['alias'] or ''}}'" ng-model="companyFormParameters.frmAlias">
                    </div>
                </div>
                <div>
                    <div id="submitBtn" name="submitBtn" class="ui blue submit button" add-company-action>Add Company</div>
                </div>
            @endif
        </div>
    </div>
</div>