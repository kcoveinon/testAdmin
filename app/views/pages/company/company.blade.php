<div id="site-administration-content" ng-controller="CompanyAdminController">
    <div class="ui header">B2B - Company List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;" new-record-click-action submodule="company">
        <i class="add icon button"></i>Add New Company
    </div>
    <div>
        <j-grid
            grid-columns="column_variable"
            grid-id="companyGrid"
            grid-limit="10"
            grid-url="company-grid/show-company-grid"
            grid-method="GET">
        </j-grid>
    </div>
    
    <div class="ui dimmable modal" id="companyModal" name="companyModal" first-modal>
        <i class="close icon"></i>
        <div class="ui tiny header ng-cloak" ng-cloak>[[firstModalParameters.title]]</div>
        <div class="content">&nbsp;</div>
    </div>
    
    <div class="ui modal" id="submodal" name="submodal" second-modal>
        <i class="close icon"></i>
        <div class="ui tiny header ng-cloak" ng-cloak>[[secondModalParameters.title]]</div>
        <div class="content">&nbsp;</div>
    </div>
</div>

