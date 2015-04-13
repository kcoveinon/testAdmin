<div id="depot-administration-content" ng-controller="DepotAdminController">
    <div class="ui header">Depot List</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;"><i class="add icon button"></i>Add New Depot</div>
    <div class="tiny ui blue labeled icon button" style="margin-bottom: 10px;" export-depot-button-action><i class="add icon button"></i>Update Records</div>
    <div>
        <j-grid
         grid-columns="column_variable"
            grid-id="depotGrid"
            grid-limit="100"
            grid-url="depot-grid/show-depot-grid"
            grid-method="GET">
        </j-grid>
    </div>
    <div class="ui small modal" depot-export-modal-action>
        <i class="close icon"></i>
        <div class="header">
            Update Depot Table
        </div>
        <div class="content">
            <div class="description">
                <div class="ui header">Test</div>
                <p>Test <a href="https://www.gravatar.com" target="_blank">gravatar</a> Test</p>
                <p>Is it okay to use this photo?</p>
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                Nope
            </div>
            <div class="ui positive right labeled icon button">
                Yep, that's me
                <i class="checkmark icon"></i>
            </div>
        </div>
    </div>

</div>