<div ng-controller="SiteAdminController">
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
            <input type="hidden" id="frmCompanyID" name="frmCompanyID" ng-init="siteFormParameters.frmCompanyID='{{ $companyID or '' }}'" ng-model="siteFormParameters.frmCompanyID">
            <input type="hidden" id="frmSiteID" name="frmSiteID" ng-init="siteFormParameters.frmSiteID='{{ $data->company_siteID or '' }}'" ng-model="siteFormParameters.frmSiteID">
            @if(isset($data))
                <div class="two fields">
                    <div class="field">
                        <label>Site Name</label>
                        <input type="text" id="frmPartnerName" name="frmPartnerName" ng-init="siteFormParameters.frmPartnerName='{{ $data->siteName or '' }}'" ng-model="siteFormParameters.frmPartnerName" placeholder="Site Name">
                    </div>
                    <div class="field">
                        <label>Site GUID</label>
                        <h3 class="ui header">{{$data->siteGUID}}</h3>
                    </div>
                </div>
                <div class="field">
                    <label>Site Information</label>
                    <textarea id="frmComment" name="frmComment" placeholder="Site Information" ng-init="siteFormParameters.frmComment='{{{$data->comment  or ''}}}'" ng-model="siteFormParameters.frmComment"></textarea>
                </div>
                <div>
                    <div id="submitBtn" name="submitBtn" class="ui blue submit button" edit-site-action>Update Site</div>
                </div>
            @else
                <div class="two fields">
                    <div class="field">
                        <label>Site Name</label>
                        <input type="text" id="frmPartnerName" name="frmPartnerName" ng-init="siteFormParameters.frmPartnerName='{{ $data->siteName or '' }}'" ng-model="siteFormParameters.frmPartnerName" placeholder="Site Name">
                    </div>
                    <div class="field">
                        <label>Site </label>
                        <input type="text" id="frmPrefix" name="frmPrefix" class="form-control" maxlength="10" ng-model="siteFormParameters.frmPrefix" placeholder="Site  (Warning! Cannot be changed when saved.)">
                    </div>
                </div>
                <div class="field">
                    <label>Site Information</label>
                    <textarea id="frmComment" name="frmComment" placeholder="Site Information" ng-init="siteFormParameters.frmComment='{{{$data->comment  or ''}}}'" ng-model="siteFormParameters.frmComment"></textarea>
                </div>
                <div>
                    <div id="submitBtn" name="submitBtn" class="ui blue submit button" add-site-action>Save Site</div>
                </div>
            @endif
        </div>
    </div>
</div>