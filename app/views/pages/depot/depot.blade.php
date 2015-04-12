<div id="depot-administration-content" ng-controller="DepotAdminController">
    <div class="ui header">Depot List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;"><i class="add icon button"></i>Add New Depot</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;"><i class="add icon button"></i>Add New Depot</div>
    <div>
        <j-grid
            grid-columns="column_variable"
            grid-id="depotGrid"
            grid-limit="100"
            grid-url="depot-grid/show-depot-grid"
            grid-method="GET">
        </j-grid>
    </div>
</div>