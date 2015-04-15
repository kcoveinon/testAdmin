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
                <div class="ui header">Choose the supplier's depots to be updated:</div>
                <div class="ui divided list">
                    <div class="item" ng-repeat="supplierObject in supplierCollection track by $index">
                        <div class=" right floated compact ui">
                            <input type="checkbox" ng-model="supplierObject.isActive" ng-show="!supplierObject.isProcessing" />
                            <div ng-show="supplierObject.isActive && supplierObject.isProcessing" class="ui active inline loader"></div>
                        </div>
                        <img class="ui avatar image" src="[[supplierObject.supplierImage]]" style="width:auto !important">
                        <div class="content">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                Close
            </div>
            <div class="ui positive right labeled icon button" ng-click="doUpdateDepots()">
                Export
                <i class="checkmark icon"></i>
            </div>
        </div>
    </div>

</div>