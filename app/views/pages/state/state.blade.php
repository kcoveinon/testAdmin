<div id="depot-administration-content" ng-controller="StateAdminController">
    <div class="ui header">State List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;"><i class="add icon button"></i>Add New Country</div>
    <div>
        <j-grid
            grid-columns="column_variable"
            grid-id="stateGrid"
            grid-limit="100"
            grid-url="state-grid/show-state-grid"
            grid-method="GET">
        </j-grid>
    </div>
</div>