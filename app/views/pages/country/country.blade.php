<div id="depot-administration-content" ng-controller="CountryAdminController">
    <div class="ui header">Country List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;"><i class="add icon button"></i>Add New Country</div>
    <div>
        <j-grid
            grid-columns="column_variable"
            grid-id="countryGrid"
            grid-limit="100"
            grid-url="country-grid/show-country-grid"
            grid-method="GET">
        </j-grid>
    </div>
</div>