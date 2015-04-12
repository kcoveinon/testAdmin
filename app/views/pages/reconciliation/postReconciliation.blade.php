<div ng-controller="postReconciliationController">
    <div class="ui header">Post Reconciliation</div>
    <div ng-if="!processedList.processedFolders.length">
        <span ng-if="!recordsLoaded">Loading records...</span>
        <span ng-if="recordsLoaded">No records found</span>
    </div>
    <div class="ui styled fluid accordion" ng-if="processedList.processedFolders.length" folders-accordion>
        <div class="title" ng-repeat-start="folder in processedList.processedFolders" folders-accordion-finish-render>
            <i class="folder icon"></i>
            [[folder.monthToProcess]]
        </div>
        <div class="content" ng-repeat-end>
            <div class="ui divided list">
                <div class="item" ng-repeat="file in processedList.processedList | filter:folder.monthToProcess">
                    <div class="right floated compact ui tiny blue button" post-process-file="Delete" processed-file-id="[[file.filesUploadedID]]">Delete</div>
                    <div class="right floated compact ui tiny red button" post-process-file="Save" processed-file-id="[[file.filesUploadedID]]">Save</div>
                    <div class="right floated compact ui tiny button" post-reconciliation-show-details="[[file.filesUploadedID]]" >Show Details</div>
                    <div class="right floated compact ui tiny button" post-reconciliation-show-summary="[[file.filesUploadedID]]" >Show Summary</div>
                    <div class="right floated compact" style="color:green">[[file.goodRecords]]%</div>
                    <div class="content">
                      <div class="header" style="color:#444444">[[file.fileName]]</div>
                    </div>
                 </div>
            </div>
        </div>
        <custom-modal
            watch = "postReconciliationShowSummaryModal()"
            content = "postReconciliationShowSummaryContent"
            settings = "postReconciliationShowSummarySettings"
        ></custom-modal>
        <custom-modal
            watch = "postReconciliationShowDetailsModal()"
            content = "postReconciliationShowDetailsContent"
            settings = "postReconciliationShowDetailsSettings"
        ></custom-modal>

    </div>

</div>
