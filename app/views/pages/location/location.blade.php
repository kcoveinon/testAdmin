<div id="location-administration-content" ng-controller="LocationAdminController">
    <div class="ui header">Locations List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;">
        <i class="add icon button"></i>Add New Location
    </div>
    <div>
        <j-grid
            grid-columns="column_variable"
            grid-id="locationGrid"
            grid-limit="100"
            grid-url="location-grid/show-location-grid"
            grid-method="GET">
        </j-grid>
    </div>
</div>