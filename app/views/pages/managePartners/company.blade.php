<div id="site-administration-content" ng-controller="managePartnersController">
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

    <custom-modal
        id = "mainModalID"
        watch = "mainModal.show"
        content = "mainModal"
    ></custom-modal>

</div>

